"""User Routes - Profile, Dashboard data"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models.user import User
from backend.models.property import Property
from backend.models.saved_property import SavedProperty
from backend.models.visit import Visit

users_bp = Blueprint('users', __name__)


@users_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get role-based dashboard data."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({'message': 'User not found'}), 404

    dashboard = {'user': user.to_dict()}

    if user.role == 'buyer':
        saved_count = SavedProperty.query.filter_by(user_id=user.id).count()
        visits_count = Visit.query.filter_by(user_id=user.id).count()
        dashboard['stats'] = {
            'saved_properties': saved_count,
            'scheduled_visits': visits_count,
            'recommendations': 8,
        }

    elif user.role == 'seller':
        my_properties = Property.query.filter_by(user_id=user.id).count()
        active_listings = Property.query.filter_by(user_id=user.id, status='approved').count()
        total_views = db.session.query(db.func.sum(Property.views_count)).filter_by(user_id=user.id).scalar() or 0
        total_inquiries = db.session.query(db.func.sum(Property.inquiries_count)).filter_by(user_id=user.id).scalar() or 0
        dashboard['stats'] = {
            'total_listings': my_properties,
            'active_listings': active_listings,
            'total_views': total_views,
            'total_inquiries': total_inquiries,
        }

    elif user.role == 'agent':
        managed_properties = Property.query.filter_by(user_id=user.id).count()
        scheduled_visits = Visit.query.filter_by(agent_id=user.id).count()
        dashboard['stats'] = {
            'managed_properties': managed_properties,
            'scheduled_visits': scheduled_visits,
            'clients': 0,
            'revenue': 0,
        }

    return jsonify(dashboard), 200


@users_bp.route('/agents', methods=['GET'])
def get_agents():
    """Get all agents."""
    agents = User.query.filter_by(role='agent', is_active=True).all()
    return jsonify({'agents': [a.to_dict() for a in agents]}), 200


@users_bp.route('/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get agent profile."""
    agent = User.query.filter_by(id=agent_id, role='agent').first_or_404()
    properties = Property.query.filter_by(user_id=agent_id, status='approved').all()
    return jsonify({
        'agent': agent.to_dict(),
        'properties': [p.to_dict() for p in properties],
    }), 200
