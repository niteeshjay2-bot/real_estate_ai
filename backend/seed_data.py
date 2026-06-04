"""Seed Database with Indian Location Data - All States, Districts, Cities"""
from backend.app import create_app, db
from backend.models.location import State, District, City
from backend.models.user import User

# Complete Indian States & Union Territories with major cities
INDIA_DATA = {
    "Andhra Pradesh": {
        "Visakhapatnam": ["Visakhapatnam", "Anakapalle", "Bhimavaram"],
        "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada"],
        "Guntur": ["Guntur", "Tenali", "Narasaraopet"],
        "Tirupati": ["Tirupati", "Chittoor", "Madanapalle"],
        "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram"],
        "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem"],
        "Kurnool": ["Kurnool", "Nandyal", "Adoni"],
        "Anantapur": ["Anantapur", "Hindupur", "Guntakal"],
    },
    "Telangana": {
        "Hyderabad": ["Hyderabad", "Secunderabad", "Gachibowli", "Kondapur", "Kokapet", "Madhapur"],
        "Rangareddy": ["Shamshabad", "LB Nagar", "Kukatpally"],
        "Warangal": ["Warangal", "Kazipet", "Hanamkonda"],
        "Karimnagar": ["Karimnagar", "Jagtial", "Peddapalli"],
        "Medchal": ["Kompally", "Shamirpet", "Medchal"],
        "Sangareddy": ["Sangareddy", "Patancheru"],
    },
    "Tamil Nadu": {
        "Chennai": ["Chennai", "Tambaram", "Velachery", "OMR", "Adyar", "Anna Nagar"],
        "Coimbatore": ["Coimbatore", "Mettupalayam", "Pollachi"],
        "Madurai": ["Madurai", "Melur", "Usilampatti"],
        "Salem": ["Salem", "Attur", "Mettur"],
        "Tiruchirappalli": ["Trichy", "Srirangam", "Lalgudi"],
        "Tirunelveli": ["Tirunelveli", "Palayamkottai"],
        "Erode": ["Erode", "Perundurai", "Gobichettipalayam"],
        "Vellore": ["Vellore", "Ambur", "Ranipet"],
        "Kancheepuram": ["Kanchipuram", "Sriperumbudur", "Mamallapuram"],
    },
    "Karnataka": {
        "Bengaluru Urban": ["Bengaluru", "Whitefield", "Electronic City", "Sarjapur", "Hebbal", "Yelahanka"],
        "Bengaluru Rural": ["Devanahalli", "Doddaballapur", "Nelamangala"],
        "Mysuru": ["Mysuru", "Nanjangud", "Hunsur"],
        "Mangaluru": ["Mangaluru", "Udupi", "Manipal"],
        "Hubli-Dharwad": ["Hubli", "Dharwad", "Gadag"],
        "Belgaum": ["Belgaum", "Gokak", "Raibag"],
        "Gulbarga": ["Gulbarga", "Yadgir", "Jewargi"],
    },
    "Maharashtra": {
        "Mumbai": ["Mumbai", "Bandra", "Andheri", "Powai", "Navi Mumbai", "Thane"],
        "Pune": ["Pune", "Hinjewadi", "Kharadi", "Baner", "Wakad", "Hadapsar"],
        "Nagpur": ["Nagpur", "Hingna", "Kamptee"],
        "Nashik": ["Nashik", "Sinnar", "Malegaon"],
        "Aurangabad": ["Aurangabad", "Jalna", "Parbhani"],
        "Thane": ["Thane", "Kalyan", "Dombivli", "Bhiwandi"],
        "Kolhapur": ["Kolhapur", "Sangli", "Ichalkaranji"],
        "Solapur": ["Solapur", "Pandharpur", "Barshi"],
    },
    "Gujarat": {
        "Ahmedabad": ["Ahmedabad", "SG Highway", "Satellite", "Bopal", "Gandhinagar"],
        "Surat": ["Surat", "Varachha", "Adajan"],
        "Vadodara": ["Vadodara", "Alkapuri", "Manjalpur"],
        "Rajkot": ["Rajkot", "Morbi", "Gondal"],
        "Bhavnagar": ["Bhavnagar", "Palitana"],
        "Jamnagar": ["Jamnagar", "Dwarka"],
    },
    "Rajasthan": {
        "Jaipur": ["Jaipur", "Mansarovar", "Vaishali Nagar", "Malviya Nagar", "Tonk Road"],
        "Jodhpur": ["Jodhpur", "Pali", "Barmer"],
        "Udaipur": ["Udaipur", "Rajsamand", "Dungarpur"],
        "Kota": ["Kota", "Bundi", "Jhalawar"],
        "Ajmer": ["Ajmer", "Pushkar", "Beawar"],
        "Bikaner": ["Bikaner", "Suratgarh"],
    },
    "Uttar Pradesh": {
        "Lucknow": ["Lucknow", "Gomti Nagar", "Hazratganj", "Alambagh"],
        "Noida": ["Noida", "Greater Noida", "Yamuna Expressway"],
        "Ghaziabad": ["Ghaziabad", "Indirapuram", "Vaishali"],
        "Agra": ["Agra", "Sikandra", "Dayalbagh"],
        "Varanasi": ["Varanasi", "Sarnath", "Ramnagar"],
        "Kanpur": ["Kanpur", "Panki", "Kidwai Nagar"],
        "Allahabad": ["Prayagraj", "Naini", "Phaphamau"],
        "Meerut": ["Meerut", "Modinagar"],
    },
    "Delhi": {
        "New Delhi": ["Connaught Place", "Saket", "Vasant Kunj", "Dwarka", "Rohini"],
        "South Delhi": ["Greater Kailash", "Hauz Khas", "Lajpat Nagar", "Defence Colony"],
        "North Delhi": ["Model Town", "Civil Lines", "Pitampura"],
        "West Delhi": ["Rajouri Garden", "Janakpuri", "Vikaspuri"],
        "East Delhi": ["Mayur Vihar", "Preet Vihar", "Laxmi Nagar"],
    },
    "Haryana": {
        "Gurgaon": ["Gurgaon", "DLF City", "Sohna Road", "Golf Course Road", "Sector 56"],
        "Faridabad": ["Faridabad", "Ballabhgarh", "NIT"],
        "Panipat": ["Panipat", "Samalkha"],
        "Ambala": ["Ambala", "Panchkula"],
        "Hisar": ["Hisar", "Hansi"],
        "Karnal": ["Karnal", "Gharaunda"],
    },
    "Punjab": {
        "Chandigarh": ["Chandigarh", "Mohali", "Kharar", "Zirakpur"],
        "Ludhiana": ["Ludhiana", "Khanna", "Jagraon"],
        "Amritsar": ["Amritsar", "Ajnala"],
        "Jalandhar": ["Jalandhar", "Phagwara", "Nakodar"],
        "Patiala": ["Patiala", "Rajpura", "Nabha"],
        "Bathinda": ["Bathinda", "Mansa"],
    },
    "West Bengal": {
        "Kolkata": ["Kolkata", "Salt Lake", "New Town", "Rajarhat", "Howrah"],
        "North 24 Parganas": ["Barasat", "Barrackpore", "Dum Dum"],
        "South 24 Parganas": ["Baruipur", "Diamond Harbour"],
        "Howrah": ["Howrah", "Shibpur", "Uluberia"],
        "Darjeeling": ["Siliguri", "Darjeeling"],
        "Durgapur": ["Durgapur", "Asansol", "Bardhaman"],
    },
    "Kerala": {
        "Ernakulam": ["Kochi", "Aluva", "Kakkanad", "Edappally"],
        "Thiruvananthapuram": ["Thiruvananthapuram", "Technopark", "Kazhakoottam"],
        "Kozhikode": ["Kozhikode", "Vatakara"],
        "Thrissur": ["Thrissur", "Chalakudy", "Irinjalakuda"],
        "Kottayam": ["Kottayam", "Pala", "Changanassery"],
        "Malappuram": ["Malappuram", "Manjeri", "Tirur"],
    },
    "Madhya Pradesh": {
        "Bhopal": ["Bhopal", "Hoshangabad Road", "Kolar"],
        "Indore": ["Indore", "Vijay Nagar", "Super Corridor"],
        "Jabalpur": ["Jabalpur", "Wright Town"],
        "Gwalior": ["Gwalior", "Lashkar", "Morar"],
        "Ujjain": ["Ujjain", "Dewas"],
    },
    "Bihar": {
        "Patna": ["Patna", "Boring Road", "Kankarbagh", "Bailey Road"],
        "Gaya": ["Gaya", "Bodh Gaya"],
        "Muzaffarpur": ["Muzaffarpur", "Hajipur"],
        "Bhagalpur": ["Bhagalpur", "Naugachia"],
        "Darbhanga": ["Darbhanga", "Madhubani"],
    },
    "Odisha": {
        "Bhubaneswar": ["Bhubaneswar", "Chandrasekharpur", "Patia"],
        "Cuttack": ["Cuttack", "Choudwar"],
        "Puri": ["Puri", "Konark"],
        "Rourkela": ["Rourkela", "Sundargarh"],
    },
    "Jharkhand": {
        "Ranchi": ["Ranchi", "Doranda", "Kanke"],
        "Jamshedpur": ["Jamshedpur", "Sonari", "Bistupur"],
        "Dhanbad": ["Dhanbad", "Jharia"],
        "Bokaro": ["Bokaro", "Chas"],
    },
    "Chhattisgarh": {
        "Raipur": ["Raipur", "Shankar Nagar", "Devendra Nagar"],
        "Bilaspur": ["Bilaspur", "Korba"],
        "Durg": ["Durg", "Bhilai"],
    },
    "Uttarakhand": {
        "Dehradun": ["Dehradun", "Mussoorie", "Rishikesh"],
        "Haridwar": ["Haridwar", "Roorkee"],
        "Nainital": ["Nainital", "Haldwani", "Bhimtal"],
    },
    "Himachal Pradesh": {
        "Shimla": ["Shimla", "Solan", "Kasauli"],
        "Kangra": ["Dharamshala", "McLeodganj", "Palampur"],
        "Kullu": ["Kullu", "Manali"],
    },
    "Goa": {
        "North Goa": ["Panaji", "Mapusa", "Calangute", "Candolim", "Porvorim"],
        "South Goa": ["Margao", "Vasco da Gama", "Benaulim"],
    },
    "Assam": {
        "Kamrup": ["Guwahati", "Dispur", "Paltan Bazaar"],
        "Dibrugarh": ["Dibrugarh", "Tinsukia"],
        "Nagaon": ["Nagaon", "Hojai"],
    },
    "Jammu & Kashmir": {
        "Srinagar": ["Srinagar", "Dal Lake", "Lal Chowk"],
        "Jammu": ["Jammu", "Katra"],
    },
    "Chandigarh": {
        "Chandigarh": ["Sector 17", "Sector 22", "Sector 35", "Manimajra"],
    },
    "Tripura": {
        "West Tripura": ["Agartala"],
    },
    "Meghalaya": {
        "East Khasi Hills": ["Shillong"],
    },
    "Manipur": {
        "Imphal West": ["Imphal"],
    },
    "Mizoram": {
        "Aizawl": ["Aizawl"],
    },
    "Nagaland": {
        "Kohima": ["Kohima", "Dimapur"],
    },
    "Arunachal Pradesh": {
        "Papum Pare": ["Itanagar"],
    },
    "Sikkim": {
        "East Sikkim": ["Gangtok"],
    },
    "Andaman & Nicobar": {
        "South Andaman": ["Port Blair"],
    },
    "Puducherry": {
        "Puducherry": ["Puducherry", "Auroville"],
    },
    "Ladakh": {
        "Leh": ["Leh"],
    },
    "Dadra & Nagar Haveli": {
        "Dadra & Nagar Haveli": ["Silvassa"],
    },
    "Lakshadweep": {
        "Lakshadweep": ["Kavaratti"],
    },
}


def seed_locations():
    """Seed all Indian locations into the database."""
    print("Seeding Indian location data...")

    for state_name, districts in INDIA_DATA.items():
        is_ut = state_name in [
            'Delhi', 'Chandigarh', 'Puducherry', 'Ladakh',
            'Andaman & Nicobar', 'Dadra & Nagar Haveli', 'Lakshadweep',
            'Jammu & Kashmir'
        ]

        state = State(name=state_name, is_union_territory=is_ut)
        db.session.add(state)
        db.session.flush()

        for district_name, cities in districts.items():
            district = District(name=district_name, state_id=state.id)
            db.session.add(district)
            db.session.flush()

            for city_name in cities:
                city = City(name=city_name, district_id=district.id)
                db.session.add(city)

    db.session.commit()
    print(f"Seeded {State.query.count()} states, {District.query.count()} districts, {City.query.count()} cities")


def seed_admin():
    """Create default admin user."""
    admin = User.query.filter_by(email='admin@infynest.ai').first()
    if not admin:
        admin = User(
            email='admin@infynest.ai',
            first_name='Admin',
            last_name='InfyNest',
            role='admin',
            is_verified=True,
            is_active=True,
        )
        admin.set_password('Admin@123')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created: admin@infynest.ai / Admin@123")


def seed_sample_properties():
    """Create sample property listings."""
    from backend.models.property import Property

    admin = User.query.filter_by(role='admin').first()
    if not admin:
        return

    sample_properties = [
        {
            'title': 'Luxury 3BHK Apartment in Bandra West',
            'description': 'Premium sea-facing apartment with modern amenities, imported fittings, and stunning views.',
            'property_type': 'apartment', 'listing_type': 'sale',
            'price': 35000000, 'area_sqft': 1800, 'bedrooms': 3, 'bathrooms': 3,
            'state': 'Maharashtra', 'city': 'Mumbai', 'locality': 'Bandra West',
            'floor_number': 15, 'total_floors': 25, 'furnishing': 'furnished',
            'has_lift': True, 'has_car_parking': True, 'has_gym': True,
            'has_swimming_pool': True, 'has_security': True, 'has_cctv': True,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': 'Modern Villa in Whitefield',
            'description': 'Spacious 4BHK villa with private garden, premium community, and IT hub proximity.',
            'property_type': 'villa', 'listing_type': 'sale',
            'price': 25000000, 'area_sqft': 3200, 'bedrooms': 4, 'bathrooms': 4,
            'state': 'Karnataka', 'city': 'Bengaluru', 'locality': 'Whitefield',
            'furnishing': 'semi-furnished',
            'has_car_parking': True, 'has_garden': True, 'has_security': True,
            'has_swimming_pool': True, 'has_club_house': True,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': 'Premium Office Space in Gachibowli',
            'description': 'Grade-A commercial space in IT corridor with all modern infrastructure.',
            'property_type': 'office_space', 'listing_type': 'rent',
            'price': 150000, 'area_sqft': 2500,
            'state': 'Telangana', 'city': 'Hyderabad', 'locality': 'Gachibowli',
            'floor_number': 8, 'total_floors': 12, 'furnishing': 'furnished',
            'has_lift': True, 'has_car_parking': True, 'has_power_backup': True,
            'has_cctv': True, 'has_security': True,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': '2BHK Apartment in Hinjewadi IT Park',
            'description': 'Budget-friendly apartment near IT hub with excellent connectivity.',
            'property_type': 'apartment', 'listing_type': 'sale',
            'price': 7500000, 'area_sqft': 950, 'bedrooms': 2, 'bathrooms': 2,
            'state': 'Maharashtra', 'city': 'Pune', 'locality': 'Hinjewadi',
            'floor_number': 7, 'total_floors': 14, 'furnishing': 'semi-furnished',
            'has_lift': True, 'has_car_parking': True, 'has_security': True,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': 'Farm House in Gurgaon Outskirts',
            'description': 'Beautiful farmhouse spread across 2 acres with lush greenery.',
            'property_type': 'farm_house', 'listing_type': 'sale',
            'price': 80000000, 'area_sqft': 87120, 'bedrooms': 5, 'bathrooms': 5,
            'state': 'Haryana', 'city': 'Gurgaon', 'locality': 'Sohna Road',
            'furnishing': 'furnished',
            'has_car_parking': True, 'has_garden': True, 'has_swimming_pool': True,
            'has_security': True, 'has_cctv': True,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': 'Residential Plot in Noida Extension',
            'description': 'Prime plot in developing area with excellent appreciation potential.',
            'property_type': 'plot', 'listing_type': 'sale',
            'price': 4500000, 'area_sqft': 1200,
            'state': 'Uttar Pradesh', 'city': 'Noida', 'locality': 'Greater Noida',
            'is_corner_plot': True, 'road_width': 40,
            'is_featured': True, 'status': 'approved',
        },
        {
            'title': 'Luxury Penthouse in DLF City',
            'description': 'Ultra-premium penthouse with private terrace, jacuzzi, and panoramic views.',
            'property_type': 'apartment', 'listing_type': 'sale',
            'price': 120000000, 'area_sqft': 5500, 'bedrooms': 5, 'bathrooms': 6,
            'state': 'Haryana', 'city': 'Gurgaon', 'locality': 'DLF City',
            'floor_number': 32, 'total_floors': 32, 'furnishing': 'furnished',
            'has_lift': True, 'has_car_parking': True, 'has_gym': True,
            'has_swimming_pool': True, 'has_club_house': True,
            'has_security': True, 'has_cctv': True, 'has_power_backup': True,
            'is_featured': True, 'is_premium': True, 'status': 'approved',
        },
        {
            'title': '3BHK Apartment in OMR Chennai',
            'description': 'Modern apartment on IT corridor with metro connectivity.',
            'property_type': 'apartment', 'listing_type': 'sale',
            'price': 9500000, 'area_sqft': 1400, 'bedrooms': 3, 'bathrooms': 2,
            'state': 'Tamil Nadu', 'city': 'Chennai', 'locality': 'OMR',
            'floor_number': 5, 'total_floors': 18, 'furnishing': 'semi-furnished',
            'has_lift': True, 'has_car_parking': True, 'has_gym': True,
            'has_security': True,
            'is_featured': True, 'status': 'approved',
        },
    ]

    for prop_data in sample_properties:
        prop = Property(user_id=admin.id, **prop_data)
        db.session.add(prop)

    db.session.commit()
    print(f"Seeded {len(sample_properties)} sample properties")


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_locations()
        seed_admin()
        seed_sample_properties()
        print("Database seeding complete!")
