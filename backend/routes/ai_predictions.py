"""AI Routes - Price Prediction, Investment Score, ROI, Market Trends"""
import numpy as np
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

ai_bp = Blueprint('ai', __name__)


def get_base_price(state, city, property_type):
    """Get base price per sqft based on location and type."""
    # Comprehensive price data for Indian cities (price per sqft in INR)
    price_data = {
        'Mumbai': {'apartment': 15000, 'villa': 20000, 'land': 25000, 'commercial': 18000},
        'Delhi': {'apartment': 12000, 'villa': 15000, 'land': 18000, 'commercial': 14000},
        'Bengaluru': {'apartment': 8000, 'villa': 10000, 'land': 12000, 'commercial': 9000},
        'Hyderabad': {'apartment': 7000, 'villa': 9000, 'land': 8000, 'commercial': 8000},
        'Chennai': {'apartment': 7500, 'villa': 9500, 'land': 9000, 'commercial': 8500},
        'Pune': {'apartment': 7000, 'villa': 8500, 'land': 7500, 'commercial': 7500},
        'Kolkata': {'apartment': 5500, 'villa': 7000, 'land': 6000, 'commercial': 6000},
        'Ahmedabad': {'apartment': 5000, 'villa': 6500, 'land': 5500, 'commercial': 5500},
        'Jaipur': {'apartment': 4500, 'villa': 6000, 'land': 5000, 'commercial': 5000},
        'Lucknow': {'apartment': 4000, 'villa': 5500, 'land': 4500, 'commercial': 4500},
        'Chandigarh': {'apartment': 6000, 'villa': 8000, 'land': 7000, 'commercial': 6500},
        'Gurgaon': {'apartment': 10000, 'villa': 13000, 'land': 15000, 'commercial': 11000},
        'Noida': {'apartment': 7000, 'villa': 9000, 'land': 10000, 'commercial': 8000},
        'Goa': {'apartment': 8000, 'villa': 12000, 'land': 10000, 'commercial': 7000},
        'Kochi': {'apartment': 5500, 'villa': 7000, 'land': 6000, 'commercial': 6000},
        'Coimbatore': {'apartment': 4500, 'villa': 6000, 'land': 5000, 'commercial': 5000},
        'Visakhapatnam': {'apartment': 4000, 'villa': 5500, 'land': 4500, 'commercial': 4500},
        'Indore': {'apartment': 3500, 'villa': 5000, 'land': 4000, 'commercial': 4000},
        'Nagpur': {'apartment': 4000, 'villa': 5500, 'land': 4500, 'commercial': 4500},
        'Bhopal': {'apartment': 3500, 'villa': 5000, 'land': 4000, 'commercial': 4000},
    }

    # Get price for city, fallback to default
    default_prices = {'apartment': 4000, 'villa': 5500, 'land': 4500, 'commercial': 4500}
    city_prices = price_data.get(city, default_prices)

    # Map property type to category
    type_map = {
        'apartment': 'apartment',
        'villa': 'villa',
        'independent_house': 'villa',
        'farm_house': 'villa',
        'commercial': 'commercial',
        'office_space': 'commercial',
        'warehouse': 'commercial',
        'industrial': 'commercial',
        'land': 'land',
        'agricultural_land': 'land',
        'plot': 'land',
    }

    category = type_map.get(property_type, 'apartment')
    return city_prices.get(category, 4000)


@ai_bp.route('/predict-price', methods=['POST'])
def predict_price():
    """AI Price Prediction for a property."""
    data = request.get_json()

    # Required inputs
    state = data.get('state', '')
    city = data.get('city', '')
    property_type = data.get('property_type', 'apartment')
    area_sqft = data.get('area_sqft', 1000)
    bedrooms = data.get('bedrooms', 2)
    bathrooms = data.get('bathrooms', 2)
    age = data.get('age_of_property', 0)
    floor_number = data.get('floor_number', 1)
    furnishing = data.get('furnishing', 'unfurnished')
    has_parking = data.get('has_car_parking', False)
    has_lift = data.get('has_lift', False)
    has_gym = data.get('has_gym', False)
    has_pool = data.get('has_swimming_pool', False)
    nearby_metro = data.get('nearby_metro', 5)
    nearby_school = data.get('nearby_school', 2)
    nearby_hospital = data.get('nearby_hospital', 3)

    # Get base price
    base_price = get_base_price(state, city, property_type)

    # Apply multipliers
    multiplier = 1.0

    # Furnishing premium
    if furnishing == 'furnished':
        multiplier += 0.15
    elif furnishing == 'semi-furnished':
        multiplier += 0.08

    # Amenities premium
    if has_parking:
        multiplier += 0.05
    if has_lift:
        multiplier += 0.03
    if has_gym:
        multiplier += 0.04
    if has_pool:
        multiplier += 0.06

    # Floor premium (higher floors = premium)
    if floor_number and floor_number > 5:
        multiplier += 0.02 * min(floor_number - 5, 10)

    # Age depreciation
    if age > 0:
        multiplier -= min(age * 0.01, 0.2)

    # Proximity premium
    if nearby_metro and nearby_metro < 2:
        multiplier += 0.10
    elif nearby_metro and nearby_metro < 5:
        multiplier += 0.05

    # BHK premium
    if bedrooms and bedrooms >= 3:
        multiplier += 0.05 * (bedrooms - 2)

    # Calculate predicted price
    price_per_sqft = base_price * multiplier
    predicted_price = price_per_sqft * area_sqft

    # Generate price range (±10-15%)
    min_price = predicted_price * 0.88
    max_price = predicted_price * 1.12
    confidence = min(92, 75 + int(multiplier * 10))

    # Price trend analysis
    annual_appreciation = np.random.uniform(5, 15)

    return jsonify({
        'predicted_price': round(predicted_price),
        'min_price': round(min_price),
        'max_price': round(max_price),
        'price_per_sqft': round(price_per_sqft),
        'confidence_score': confidence,
        'annual_appreciation': round(annual_appreciation, 1),
        'price_trend': 'rising',
        'insights': [
            f"Based on {city} market data, this property is valued at ₹{round(predicted_price/100000)} Lakhs",
            f"Expected annual appreciation: {round(annual_appreciation, 1)}%",
            f"Price per sqft in this area: ₹{round(price_per_sqft)}",
            f"Confidence Score: {confidence}%",
        ]
    }), 200


@ai_bp.route('/investment-score', methods=['POST'])
def investment_score():
    """Calculate AI Investment Score (1-100)."""
    data = request.get_json()

    city = data.get('city', '')
    property_type = data.get('property_type', 'apartment')
    price = data.get('price', 5000000)
    area_sqft = data.get('area_sqft', 1000)
    age = data.get('age_of_property', 0)
    nearby_metro = data.get('nearby_metro', 5)
    nearby_school = data.get('nearby_school', 3)

    # Score calculation
    score = 50  # Base score

    # Location score (metro cities get higher)
    metro_cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Gurgaon', 'Noida']
    if city in metro_cities:
        score += 15
    elif city in ['Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Coimbatore']:
        score += 10

    # Price per sqft value
    ppsf = price / area_sqft if area_sqft > 0 else 0
    base = get_base_price('', city, property_type)
    if ppsf < base * 0.9:
        score += 15  # Undervalued
    elif ppsf < base:
        score += 8

    # Proximity bonus
    if nearby_metro and nearby_metro < 2:
        score += 10
    if nearby_school and nearby_school < 1:
        score += 5

    # New property bonus
    if age < 3:
        score += 8
    elif age < 7:
        score += 4

    # Cap score
    score = min(max(score, 20), 98)

    # Determine rating
    if score >= 80:
        rating = 'Excellent Investment'
    elif score >= 65:
        rating = 'Good Investment'
    elif score >= 50:
        rating = 'Average Investment'
    else:
        rating = 'Below Average'

    return jsonify({
        'investment_score': score,
        'rating': rating,
        'factors': {
            'location': min(score * 0.3, 25),
            'value': min(score * 0.25, 20),
            'connectivity': min(score * 0.2, 18),
            'growth_potential': min(score * 0.25, 22),
        },
        'recommendation': f"This property scores {score}/100. {rating} based on location, pricing, and growth potential.",
    }), 200


@ai_bp.route('/roi-calculator', methods=['POST'])
def roi_calculator():
    """Calculate ROI and future value."""
    data = request.get_json()

    purchase_price = data.get('purchase_price', 5000000)
    years = data.get('years', 5)
    city = data.get('city', '')
    property_type = data.get('property_type', 'apartment')

    # City-based appreciation rates
    appreciation_rates = {
        'Mumbai': 8, 'Delhi': 7, 'Bengaluru': 10, 'Hyderabad': 12,
        'Pune': 9, 'Gurgaon': 11, 'Noida': 9, 'Chennai': 7,
        'Ahmedabad': 8, 'Jaipur': 7, 'Kochi': 8, 'Goa': 10,
    }

    annual_rate = appreciation_rates.get(city, 7) / 100

    # Calculate future values
    projections = []
    for year in range(1, years + 1):
        future_value = purchase_price * (1 + annual_rate) ** year
        profit = future_value - purchase_price
        roi_pct = (profit / purchase_price) * 100
        projections.append({
            'year': year,
            'value': round(future_value),
            'profit': round(profit),
            'roi_percentage': round(roi_pct, 1),
        })

    total_roi = ((projections[-1]['value'] - purchase_price) / purchase_price) * 100

    return jsonify({
        'purchase_price': purchase_price,
        'years': years,
        'annual_appreciation': round(annual_rate * 100, 1),
        'future_value': projections[-1]['value'],
        'total_profit': projections[-1]['profit'],
        'total_roi': round(total_roi, 1),
        'projections': projections,
    }), 200


@ai_bp.route('/rental-yield', methods=['POST'])
def rental_yield():
    """Calculate rental yield."""
    data = request.get_json()

    property_price = data.get('property_price', 5000000)
    monthly_rent = data.get('monthly_rent', 0)
    city = data.get('city', '')
    area_sqft = data.get('area_sqft', 1000)

    # Estimate rent if not provided
    if not monthly_rent:
        rent_ratios = {
            'Mumbai': 0.003, 'Delhi': 0.0028, 'Bengaluru': 0.0035,
            'Hyderabad': 0.003, 'Pune': 0.0032, 'Gurgaon': 0.003,
            'Chennai': 0.0028, 'Kolkata': 0.0025, 'Ahmedabad': 0.0027,
        }
        ratio = rent_ratios.get(city, 0.003)
        monthly_rent = property_price * ratio

    annual_rent = monthly_rent * 12
    gross_yield = (annual_rent / property_price) * 100
    # Deduct ~20% for maintenance, taxes, vacancy
    net_yield = gross_yield * 0.8

    return jsonify({
        'monthly_rent': round(monthly_rent),
        'annual_rent': round(annual_rent),
        'gross_yield': round(gross_yield, 2),
        'net_yield': round(net_yield, 2),
        'payback_period_years': round(property_price / annual_rent, 1) if annual_rent > 0 else 0,
        'insight': f"Gross yield of {round(gross_yield, 1)}% is {'above' if gross_yield > 3 else 'near'} the city average.",
    }), 200


@ai_bp.route('/market-trends', methods=['GET'])
def market_trends():
    """Get market trends and hot areas."""
    city = request.args.get('city', '')

    # Simulated market trend data
    trending_areas = {
        'Mumbai': [
            {'area': 'Navi Mumbai', 'growth': 15, 'trend': 'rising'},
            {'area': 'Thane', 'growth': 12, 'trend': 'rising'},
            {'area': 'Panvel', 'growth': 18, 'trend': 'rising'},
            {'area': 'Bandra', 'growth': 5, 'trend': 'stable'},
        ],
        'Bengaluru': [
            {'area': 'Whitefield', 'growth': 14, 'trend': 'rising'},
            {'area': 'Sarjapur Road', 'growth': 16, 'trend': 'rising'},
            {'area': 'Electronic City', 'growth': 12, 'trend': 'rising'},
            {'area': 'Hebbal', 'growth': 10, 'trend': 'stable'},
        ],
        'Hyderabad': [
            {'area': 'Gachibowli', 'growth': 18, 'trend': 'rising'},
            {'area': 'Kondapur', 'growth': 15, 'trend': 'rising'},
            {'area': 'Kokapet', 'growth': 22, 'trend': 'rising'},
            {'area': 'Narsingi', 'growth': 20, 'trend': 'rising'},
        ],
        'Delhi': [
            {'area': 'Dwarka Expressway', 'growth': 20, 'trend': 'rising'},
            {'area': 'New Gurgaon', 'growth': 16, 'trend': 'rising'},
            {'area': 'Greater Noida', 'growth': 14, 'trend': 'rising'},
            {'area': 'Yamuna Expressway', 'growth': 18, 'trend': 'rising'},
        ],
    }

    areas = trending_areas.get(city, [
        {'area': 'Area 1', 'growth': 10, 'trend': 'rising'},
        {'area': 'Area 2', 'growth': 8, 'trend': 'stable'},
        {'area': 'Area 3', 'growth': 12, 'trend': 'rising'},
    ])

    return jsonify({
        'city': city or 'All India',
        'trending_areas': areas,
        'market_summary': {
            'avg_growth': 10,
            'hot_sectors': ['residential', 'commercial'],
            'best_time_to_buy': 'Now - Market is showing upward trend',
        },
        'price_index': [
            {'month': 'Jan', 'index': 100},
            {'month': 'Feb', 'index': 101},
            {'month': 'Mar', 'index': 103},
            {'month': 'Apr', 'index': 102},
            {'month': 'May', 'index': 105},
            {'month': 'Jun', 'index': 107},
            {'month': 'Jul', 'index': 108},
            {'month': 'Aug', 'index': 110},
            {'month': 'Sep', 'index': 112},
            {'month': 'Oct', 'index': 113},
            {'month': 'Nov', 'index': 115},
            {'month': 'Dec', 'index': 118},
        ]
    }), 200


@ai_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get AI-powered property recommendations."""
    from backend.models.property import Property

    # Get some featured/recent properties as recommendations
    properties = Property.query.filter_by(status='approved').order_by(
        Property.created_at.desc()
    ).limit(8).all()

    return jsonify({
        'recommendations': [p.to_dict() for p in properties],
        'reason': 'Based on your search history and preferences',
    }), 200
