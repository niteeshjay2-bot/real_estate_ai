"""Admin Routes - User management, Property approvals, Analytics"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models.user import User
from backend.models.property import Property
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)


def require_admin(f):
    """Decorator to require admin role."""
    from functools import wraps

    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated


@admin_bp.route('/dashboard', methods=['GET'])
@require_admin
def admin_dashboard():
    """Get admin dashboard statistics."""
    total_users = User.query.count()
    total_properties = Property.query.count()
    pending_properties = Property.query.filter_by(status='pending').count()
    approved_properties = Property.query.filter_by(status='approved').count()

    # Role counts
    buyers = User.query.filter_by(role='buyer').count()
    sellers = User.query.filter_by(role='seller').count()
    agents = User.query.filter_by(role='agent').count()

    # Revenue estimate (properties * average commission)
    total_value = db.session.query(func.sum(Property.price)).filter_by(status='approved').scalar() or 0

    return jsonify({
        'stats': {
            'total_users': total_users,
            'total_properties': total_properties,
            'pending_approvals': pending_properties,
            'approved_listings': approved_properties,
            'buyers': buyers,
            'sellers': sellers,
            'agents': agents,
            'total_property_value': total_value,
        },
        'recent_users': [u.to_dict() for u in User.query.order_by(User.created_at.desc()).limit(5).all()],
        'recent_properties': [p.to_dict() for p in Property.query.order_by(Property.created_at.desc()).limit(5).all()],
    }), 200


@admin_bp.route('/users', methods=['GET'])
@require_admin
def get_users():
    """Get all users with pagination."""
    page = request.args.get('page', 1, type=int)
    role = request.args.get('role')
    query = User.query

    if role:
        query = query.filter_by(role=role)

    users = query.order_by(User.created_at.desc()).paginate(page=page, per_page=20, error_out=False)

    return jsonify({
        'users': [u.to_dict() for u in users.items],
        'total': users.total,
        'pages': users.pages,
    }), 200


@admin_bp.route('/users/<int:user_id>/toggle-active', methods=['PUT'])
@require_admin
def toggle_user_active(user_id):
    """Activate/deactivate a user."""
    user = User.query.get_or_404(user_id)
    user.is_active = not user.is_active
    db.session.commit()
    return jsonify({'message': f"User {'activated' if user.is_active else 'deactivated'}", 'user': user.to_dict()}), 200


@admin_bp.route('/properties/pending', methods=['GET'])
@require_admin
def get_pending_properties():
    """Get properties waiting for approval."""
    props = Property.query.filter_by(status='pending').order_by(Property.created_at.desc()).all()
    return jsonify({'properties': [p.to_dict() for p in props]}), 200


@admin_bp.route('/properties/<int:prop_id>/approve', methods=['PUT'])
@require_admin
def approve_property(prop_id):
    """Approve a property listing."""
    prop = Property.query.get_or_404(prop_id)
    prop.status = 'approved'
    db.session.commit()
    return jsonify({'message': 'Property approved', 'property': prop.to_dict()}), 200


@admin_bp.route('/properties/<int:prop_id>/reject', methods=['PUT'])
@require_admin
def reject_property(prop_id):
    """Reject a property listing."""
    prop = Property.query.get_or_404(prop_id)
    prop.status = 'rejected'
    db.session.commit()
    return jsonify({'message': 'Property rejected', 'property': prop.to_dict()}), 200


@admin_bp.route('/analytics', methods=['GET'])
@require_admin
def get_analytics():
    """Get comprehensive analytics."""
    # State-wise distribution
    state_stats = db.session.query(
        Property.state, func.count(Property.id)
    ).group_by(Property.state).all()

    # Property type distribution
    type_stats = db.session.query(
        Property.property_type, func.count(Property.id)
    ).group_by(Property.property_type).all()

    # Monthly listings
    monthly = db.session.query(
        func.extract('month', Property.created_at).label('month'),
        func.count(Property.id)
    ).group_by('month').all()

    return jsonify({
        'state_distribution': [{'state': s, 'count': c} for s, c in state_stats],
        'type_distribution': [{'type': t, 'count': c} for t, c in type_stats],
        'monthly_listings': [{'month': int(m), 'count': c} for m, c in monthly if m],
    }), 200
