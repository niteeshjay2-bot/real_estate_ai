"""Location Routes - Indian States, Districts, Cities API"""
from flask import Blueprint, request, jsonify
from backend.models.location import State, District, City

locations_bp = Blueprint('locations', __name__)


@locations_bp.route('/states', methods=['GET'])
def get_states():
    """Get all Indian states and union territories."""
    states = State.query.order_by(State.name).all()
    return jsonify({'states': [s.to_dict() for s in states]}), 200


@locations_bp.route('/districts/<int:state_id>', methods=['GET'])
def get_districts(state_id):
    """Get districts by state."""
    districts = District.query.filter_by(state_id=state_id).order_by(District.name).all()
    return jsonify({'districts': [d.to_dict() for d in districts]}), 200


@locations_bp.route('/cities/<int:district_id>', methods=['GET'])
def get_cities(district_id):
    """Get cities by district."""
    cities = City.query.filter_by(district_id=district_id).order_by(City.name).all()
    return jsonify({'cities': [c.to_dict() for c in cities]}), 200


@locations_bp.route('/search', methods=['GET'])
def search_locations():
    """Search cities across all states."""
    query = request.args.get('q', '')
    if len(query) < 2:
        return jsonify({'results': []}), 200

    cities = City.query.filter(City.name.ilike(f'%{query}%')).limit(20).all()
    results = []
    for city in cities:
        district = District.query.get(city.district_id)
        state = State.query.get(district.state_id) if district else None
        results.append({
            'city': city.name,
            'district': district.name if district else '',
            'state': state.name if state else '',
            'city_id': city.id,
        })

    return jsonify({'results': results}), 200
