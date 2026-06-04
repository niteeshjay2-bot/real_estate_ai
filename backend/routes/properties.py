"""Property Routes - CRUD, Search, Filters"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.app import db
from backend.models.property import Property, PropertyImage
from backend.models.user import User
from backend.models.saved_property import SavedProperty

properties_bp = Blueprint('properties', __name__)


@properties_bp.route('/', methods=['GET'])
def get_properties():
    """Get all properties with filters."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    query = Property.query.filter_by(status='approved')

    # Apply filters
    state = request.args.get('state')
    city = request.args.get('city')
    property_type = request.args.get('property_type')
    listing_type = request.args.get('listing_type')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    bedrooms = request.args.get('bedrooms', type=int)
    min_area = request.args.get('min_area', type=float)
    max_area = request.args.get('max_area', type=float)
    furnishing = request.args.get('furnishing')

    if state:
        query = query.filter(Property.state.ilike(f'%{state}%'))
    if city:
        query = query.filter(Property.city.ilike(f'%{city}%'))
    if property_type:
        query = query.filter_by(property_type=property_type)
    if listing_type:
        query = query.filter_by(listing_type=listing_type)
    if min_price:
        query = query.filter(Property.price >= min_price)
    if max_price:
        query = query.filter(Property.price <= max_price)
    if bedrooms:
        query = query.filter_by(bedrooms=bedrooms)
    if min_area:
        query = query.filter(Property.area_sqft >= min_area)
    if max_area:
        query = query.filter(Property.area_sqft <= max_area)
    if furnishing:
        query = query.filter_by(furnishing=furnishing)

    # Sorting
    sort = request.args.get('sort', 'newest')
    if sort == 'price_low':
        query = query.order_by(Property.price.asc())
    elif sort == 'price_high':
        query = query.order_by(Property.price.desc())
    elif sort == 'area':
        query = query.order_by(Property.area_sqft.desc())
    else:
        query = query.order_by(Property.created_at.desc())

    # Paginate
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'properties': [p.to_dict() for p in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
    }), 200


@properties_bp.route('/<int:property_id>', methods=['GET'])
def get_property(property_id):
    """Get single property details."""
    prop = Property.query.get_or_404(property_id)
    prop.views_count += 1
    db.session.commit()
    return jsonify({'property': prop.to_dict()}), 200


@properties_bp.route('/', methods=['POST'])
@jwt_required()
def create_property():
    """Create a new property listing."""
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if user.role not in ['seller', 'agent', 'admin']:
        return jsonify({'message': 'Only sellers and agents can list properties'}), 403

    data = request.get_json()

    # Validate required fields
    required = ['title', 'property_type', 'price', 'area_sqft', 'state', 'city']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} is required'}), 400

    prop = Property(
        user_id=int(user_id),
        title=data['title'],
        description=data.get('description'),
        property_type=data['property_type'],
        listing_type=data.get('listing_type', 'sale'),
        price=data['price'],
        price_per_sqft=data.get('price_per_sqft'),
        maintenance_charge=data.get('maintenance_charge'),
        negotiable=data.get('negotiable', True),
        state=data['state'],
        city=data['city'],
        locality=data.get('locality'),
        address=data.get('address'),
        pincode=data.get('pincode'),
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        area_sqft=data['area_sqft'],
        carpet_area=data.get('carpet_area'),
        built_up_area=data.get('built_up_area'),
        plot_area=data.get('plot_area'),
        bedrooms=data.get('bedrooms'),
        bathrooms=data.get('bathrooms'),
        balconies=data.get('balconies'),
        floor_number=data.get('floor_number'),
        total_floors=data.get('total_floors'),
        facing=data.get('facing'),
        age_of_property=data.get('age_of_property'),
        furnishing=data.get('furnishing'),
        has_lift=data.get('has_lift', False),
        has_car_parking=data.get('has_car_parking', False),
        has_bike_parking=data.get('has_bike_parking', False),
        has_power_backup=data.get('has_power_backup', False),
        has_security=data.get('has_security', False),
        has_gym=data.get('has_gym', False),
        has_swimming_pool=data.get('has_swimming_pool', False),
        has_club_house=data.get('has_club_house', False),
        has_cctv=data.get('has_cctv', False),
        has_garden=data.get('has_garden', False),
        has_water_supply=data.get('has_water_supply', False),
        has_gas_pipeline=data.get('has_gas_pipeline', False),
        road_width=data.get('road_width'),
        is_corner_plot=data.get('is_corner_plot', False),
        nearby_school=data.get('nearby_school'),
        nearby_hospital=data.get('nearby_hospital'),
        nearby_metro=data.get('nearby_metro'),
        nearby_airport=data.get('nearby_airport'),
        nearby_mall=data.get('nearby_mall'),
        nearby_bus_stop=data.get('nearby_bus_stop'),
        status='approved' if user.role == 'admin' else 'pending',
    )

    db.session.add(prop)
    db.session.commit()

    return jsonify({'message': 'Property listed successfully', 'property': prop.to_dict()}), 201


@properties_bp.route('/<int:property_id>', methods=['PUT'])
@jwt_required()
def update_property(property_id):
    """Update a property listing."""
    user_id = get_jwt_identity()
    prop = Property.query.get_or_404(property_id)

    if prop.user_id != int(user_id):
        user = User.query.get(int(user_id))
        if user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()

    # Update fields
    updatable = ['title', 'description', 'price', 'area_sqft', 'bedrooms', 'bathrooms',
                 'furnishing', 'locality', 'address', 'pincode', 'floor_number',
                 'total_floors', 'facing', 'age_of_property', 'negotiable',
                 'has_lift', 'has_car_parking', 'has_bike_parking', 'has_power_backup',
                 'has_security', 'has_gym', 'has_swimming_pool', 'has_club_house',
                 'has_cctv', 'has_garden', 'maintenance_charge']

    for field in updatable:
        if field in data:
            setattr(prop, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Property updated', 'property': prop.to_dict()}), 200


@properties_bp.route('/<int:property_id>', methods=['DELETE'])
@jwt_required()
def delete_property(property_id):
    """Delete a property listing."""
    user_id = get_jwt_identity()
    prop = Property.query.get_or_404(property_id)

    if prop.user_id != int(user_id):
        user = User.query.get(int(user_id))
        if user.role != 'admin':
            return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(prop)
    db.session.commit()
    return jsonify({'message': 'Property deleted'}), 200


@properties_bp.route('/my-listings', methods=['GET'])
@jwt_required()
def my_listings():
    """Get current user's property listings."""
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    properties = Property.query.filter_by(user_id=int(user_id)).order_by(
        Property.created_at.desc()
    ).paginate(page=page, per_page=12, error_out=False)

    return jsonify({
        'properties': [p.to_dict() for p in properties.items],
        'total': properties.total,
        'pages': properties.pages,
    }), 200


@properties_bp.route('/save/<int:property_id>', methods=['POST'])
@jwt_required()
def save_property(property_id):
    """Save/unsave a property (wishlist)."""
    user_id = get_jwt_identity()

    existing = SavedProperty.query.filter_by(
        user_id=int(user_id), property_id=property_id
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'message': 'Property removed from saved', 'saved': False}), 200
    else:
        saved = SavedProperty(user_id=int(user_id), property_id=property_id)
        db.session.add(saved)
        db.session.commit()
        return jsonify({'message': 'Property saved', 'saved': True}), 200


@properties_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_properties():
    """Get user's saved properties."""
    user_id = get_jwt_identity()
    saved = SavedProperty.query.filter_by(user_id=int(user_id)).all()
    properties = [Property.query.get(s.property_id).to_dict() for s in saved if Property.query.get(s.property_id)]
    return jsonify({'properties': properties}), 200


@properties_bp.route('/featured', methods=['GET'])
def get_featured():
    """Get featured properties."""
    props = Property.query.filter_by(is_featured=True, status='approved').limit(8).all()
    return jsonify({'properties': [p.to_dict() for p in props]}), 200


@properties_bp.route('/compare', methods=['POST'])
def compare_properties():
    """Compare multiple properties."""
    data = request.get_json()
    ids = data.get('property_ids', [])

    if len(ids) < 2 or len(ids) > 4:
        return jsonify({'message': 'Select 2-4 properties to compare'}), 400

    properties = Property.query.filter(Property.id.in_(ids)).all()
    return jsonify({'properties': [p.to_dict() for p in properties]}), 200
