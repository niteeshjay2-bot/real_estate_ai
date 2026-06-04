"""Authentication Routes - Register, Login, Google OAuth, Password Reset"""
from datetime import datetime, timedelta
import secrets
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from backend.app import db, limiter
from backend.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    """Register a new user."""
    data = request.get_json()

    # Validate required fields
    required = ['email', 'password', 'first_name', 'last_name', 'role']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    # Validate role
    valid_roles = ['buyer', 'seller', 'agent']
    if data['role'] not in valid_roles:
        return jsonify({'message': 'Invalid role. Choose buyer, seller, or agent'}), 400

    # Check if email exists
    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'message': 'Email already registered'}), 409

    # Validate password
    if len(data['password']) < 8:
        return jsonify({'message': 'Password must be at least 8 characters'}), 400

    # Create user
    user = User(
        email=data['email'].lower(),
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone=data.get('phone'),
        role=data['role'],
        verification_token=secrets.token_urlsafe(32),
    )
    user.set_password(data['password'])

    # Agent-specific fields
    if data['role'] == 'agent':
        user.agency_name = data.get('agency_name')
        user.license_number = data.get('license_number')
        user.experience_years = data.get('experience_years')

    db.session.add(user)
    db.session.commit()

    # Generate tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'message': 'Registration successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 201


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    """Login with email and password."""
    data = request.get_json()

    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    user = User.query.filter_by(email=data['email'].lower()).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401

    if not user.is_active:
        return jsonify({'message': 'Account has been deactivated'}), 403

    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 200


@auth_bp.route('/google', methods=['POST'])
def google_login():
    """Login/Register with Google."""
    data = request.get_json()

    if not data.get('google_id') or not data.get('email'):
        return jsonify({'message': 'Google authentication data required'}), 400

    # Check if user exists with Google ID
    user = User.query.filter_by(google_id=data['google_id']).first()

    if not user:
        # Check by email
        user = User.query.filter_by(email=data['email'].lower()).first()
        if user:
            # Link Google account
            user.google_id = data['google_id']
            user.is_verified = True
        else:
            # Create new user
            user = User(
                email=data['email'].lower(),
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
                google_id=data['google_id'],
                avatar=data.get('avatar'),
                role=data.get('role', 'buyer'),
                is_verified=True,
            )
            db.session.add(user)

    user.last_login = datetime.utcnow()
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        'message': 'Google login successful',
        'user': user.to_dict(),
        'access_token': access_token,
        'refresh_token': refresh_token,
    }), 200


@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("3 per minute")
def forgot_password():
    """Send password reset link."""
    data = request.get_json()
    email = data.get('email', '').lower()

    user = User.query.filter_by(email=email).first()
    if user:
        user.reset_token = secrets.token_urlsafe(32)
        user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()
        # In production, send email with reset link
        # send_reset_email(user.email, user.reset_token)

    # Always return success to prevent email enumeration
    return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token."""
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({'message': 'Token and new password are required'}), 400

    if len(new_password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters'}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user or not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        return jsonify({'message': 'Invalid or expired reset token'}), 400

    user.set_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.session.commit()

    return jsonify({'message': 'Password reset successful'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current logged-in user."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    """Refresh access token."""
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    data = request.get_json()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Update fields
    updatable = ['first_name', 'last_name', 'phone', 'state', 'city', 'bio',
                 'agency_name', 'experience_years', 'specialization']
    for field in updatable:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200
