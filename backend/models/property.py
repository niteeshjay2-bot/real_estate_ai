"""Property Model - Comprehensive property listing with dynamic fields"""
from datetime import datetime
from backend.app import db


class Property(db.Model):
    __tablename__ = 'properties'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Basic Info
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    property_type = db.Column(db.String(50), nullable=False)  # apartment, villa, land, etc.
    listing_type = db.Column(db.String(20), nullable=False, default='sale')  # sale, rent
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, sold

    # Pricing
    price = db.Column(db.Float, nullable=False)
    price_per_sqft = db.Column(db.Float, nullable=True)
    maintenance_charge = db.Column(db.Float, nullable=True)
    negotiable = db.Column(db.Boolean, default=True)

    # Location
    state = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    locality = db.Column(db.String(100), nullable=True)
    address = db.Column(db.Text, nullable=True)
    pincode = db.Column(db.String(10), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    # Dimensions
    area_sqft = db.Column(db.Float, nullable=False)
    carpet_area = db.Column(db.Float, nullable=True)
    built_up_area = db.Column(db.Float, nullable=True)
    plot_area = db.Column(db.Float, nullable=True)

    # Apartment/Villa specific
    bedrooms = db.Column(db.Integer, nullable=True)
    bathrooms = db.Column(db.Integer, nullable=True)
    balconies = db.Column(db.Integer, nullable=True)
    floor_number = db.Column(db.Integer, nullable=True)
    total_floors = db.Column(db.Integer, nullable=True)
    facing = db.Column(db.String(20), nullable=True)  # N, S, E, W, NE, NW, SE, SW
    age_of_property = db.Column(db.Integer, nullable=True)  # years

    # Furnishing
    furnishing = db.Column(db.String(20), nullable=True)  # furnished, semi-furnished, unfurnished

    # Amenities (stored as booleans for common ones)
    has_lift = db.Column(db.Boolean, default=False)
    has_car_parking = db.Column(db.Boolean, default=False)
    has_bike_parking = db.Column(db.Boolean, default=False)
    has_power_backup = db.Column(db.Boolean, default=False)
    has_security = db.Column(db.Boolean, default=False)
    has_gym = db.Column(db.Boolean, default=False)
    has_swimming_pool = db.Column(db.Boolean, default=False)
    has_club_house = db.Column(db.Boolean, default=False)
    has_cctv = db.Column(db.Boolean, default=False)
    has_garden = db.Column(db.Boolean, default=False)
    has_water_supply = db.Column(db.Boolean, default=False)
    has_gas_pipeline = db.Column(db.Boolean, default=False)

    # Land specific
    road_width = db.Column(db.Float, nullable=True)
    is_corner_plot = db.Column(db.Boolean, default=False)

    # Nearby (distances in km)
    nearby_school = db.Column(db.Float, nullable=True)
    nearby_hospital = db.Column(db.Float, nullable=True)
    nearby_metro = db.Column(db.Float, nullable=True)
    nearby_airport = db.Column(db.Float, nullable=True)
    nearby_mall = db.Column(db.Float, nullable=True)
    nearby_bus_stop = db.Column(db.Float, nullable=True)

    # AI Predictions (cached)
    ai_predicted_price = db.Column(db.Float, nullable=True)
    ai_investment_score = db.Column(db.Float, nullable=True)
    ai_confidence_score = db.Column(db.Float, nullable=True)

    # Metadata
    views_count = db.Column(db.Integer, default=0)
    inquiries_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    is_premium = db.Column(db.Boolean, default=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    images = db.relationship('PropertyImage', backref='property', lazy='dynamic', cascade='all, delete-orphan')
    amenities = db.relationship('PropertyAmenity', backref='property', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        """Convert to dictionary for API responses."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'property_type': self.property_type,
            'listing_type': self.listing_type,
            'status': self.status,
            'price': self.price,
            'price_per_sqft': self.price_per_sqft,
            'maintenance_charge': self.maintenance_charge,
            'negotiable': self.negotiable,
            'state': self.state,
            'city': self.city,
            'locality': self.locality,
            'address': self.address,
            'pincode': self.pincode,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'area_sqft': self.area_sqft,
            'carpet_area': self.carpet_area,
            'built_up_area': self.built_up_area,
            'plot_area': self.plot_area,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'balconies': self.balconies,
            'floor_number': self.floor_number,
            'total_floors': self.total_floors,
            'facing': self.facing,
            'age_of_property': self.age_of_property,
            'furnishing': self.furnishing,
            'amenities': {
                'lift': self.has_lift,
                'car_parking': self.has_car_parking,
                'bike_parking': self.has_bike_parking,
                'power_backup': self.has_power_backup,
                'security': self.has_security,
                'gym': self.has_gym,
                'swimming_pool': self.has_swimming_pool,
                'club_house': self.has_club_house,
                'cctv': self.has_cctv,
                'garden': self.has_garden,
                'water_supply': self.has_water_supply,
                'gas_pipeline': self.has_gas_pipeline,
            },
            'road_width': self.road_width,
            'is_corner_plot': self.is_corner_plot,
            'nearby': {
                'school': self.nearby_school,
                'hospital': self.nearby_hospital,
                'metro': self.nearby_metro,
                'airport': self.nearby_airport,
                'mall': self.nearby_mall,
                'bus_stop': self.nearby_bus_stop,
            },
            'ai_predicted_price': self.ai_predicted_price,
            'ai_investment_score': self.ai_investment_score,
            'ai_confidence_score': self.ai_confidence_score,
            'views_count': self.views_count,
            'inquiries_count': self.inquiries_count,
            'is_featured': self.is_featured,
            'is_premium': self.is_premium,
            'images': [img.to_dict() for img in self.images.all()],
            'owner_name': self.owner.full_name if self.owner else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<Property {self.title} - {self.city}>'


class PropertyImage(db.Model):
    __tablename__ = 'property_images'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    caption = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'image_url': self.image_url,
            'is_primary': self.is_primary,
            'caption': self.caption,
        }


class PropertyAmenity(db.Model):
    __tablename__ = 'property_amenities'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    amenity_name = db.Column(db.String(100), nullable=False)
    amenity_value = db.Column(db.String(200), nullable=True)
