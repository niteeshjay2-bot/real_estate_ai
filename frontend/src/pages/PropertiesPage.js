import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PropertiesPage = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    property_type: searchParams.get('property_type') || '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    furnishing: '',
    sort: 'newest',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for demo
  useEffect(() => {
    const sampleProps = [
      { id: 1, title: 'Luxury 3BHK Apartment in Bandra West', property_type: 'apartment', price: 35000000, area_sqft: 1800, bedrooms: 3, bathrooms: 3, city: 'Mumbai', state: 'Maharashtra', locality: 'Bandra West', furnishing: 'furnished', is_featured: true, images: [], ai_investment_score: 87 },
      { id: 2, title: 'Modern Villa in Whitefield', property_type: 'villa', price: 25000000, area_sqft: 3200, bedrooms: 4, bathrooms: 4, city: 'Bengaluru', state: 'Karnataka', locality: 'Whitefield', furnishing: 'semi-furnished', is_featured: true, images: [], ai_investment_score: 82 },
      { id: 3, title: 'Premium Office Space in Gachibowli', property_type: 'office_space', price: 150000, area_sqft: 2500, city: 'Hyderabad', state: 'Telangana', locality: 'Gachibowli', furnishing: 'furnished', listing_type: 'rent', images: [], ai_investment_score: 75 },
      { id: 4, title: '2BHK Apartment in Hinjewadi', property_type: 'apartment', price: 7500000, area_sqft: 950, bedrooms: 2, bathrooms: 2, city: 'Pune', state: 'Maharashtra', locality: 'Hinjewadi', furnishing: 'semi-furnished', images: [], ai_investment_score: 79 },
      { id: 5, title: 'Farm House in Gurgaon Outskirts', property_type: 'farm_house', price: 80000000, area_sqft: 87120, bedrooms: 5, bathrooms: 5, city: 'Gurgaon', state: 'Haryana', locality: 'Sohna Road', furnishing: 'furnished', images: [], ai_investment_score: 91 },
      { id: 6, title: 'Residential Plot in Noida Extension', property_type: 'plot', price: 4500000, area_sqft: 1200, city: 'Noida', state: 'Uttar Pradesh', locality: 'Greater Noida', images: [], ai_investment_score: 72 },
      { id: 7, title: 'Luxury Penthouse in DLF City', property_type: 'apartment', price: 120000000, area_sqft: 5500, bedrooms: 5, bathrooms: 6, city: 'Gurgaon', state: 'Haryana', locality: 'DLF City', furnishing: 'furnished', is_premium: true, images: [], ai_investment_score: 95 },
      { id: 8, title: '3BHK Apartment in OMR Chennai', property_type: 'apartment', price: 9500000, area_sqft: 1400, bedrooms: 3, bathrooms: 2, city: 'Chennai', state: 'Tamil Nadu', locality: 'OMR', furnishing: 'semi-furnished', images: [], ai_investment_score: 76 },
    ];
    setProperties(sampleProps);
  }, []);

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const filteredProperties = properties.filter(p => {
    if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.property_type && p.property_type !== filters.property_type) return false;
    if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
    return true;
  });

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Header */}
      <div className="bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredProperties.length} properties found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card-glass p-6 sticky top-24">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <input type="text" value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="input-field mt-1" placeholder="Enter city" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Property Type</label>
                  <select value={filters.property_type}
                    onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                    className="input-field mt-1">
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="independent_house">Independent House</option>
                    <option value="farm_house">Farm House</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                    <option value="office_space">Office Space</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                  <select value={filters.bedrooms}
                    onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    className="input-field mt-1">
                    <option value="">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                  <select value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    className="input-field mt-1">
                    <option value="newest">Newest First</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="area">Area: Largest</option>
                  </select>
                </div>

                <button onClick={() => setFilters({ city: '', property_type: '', min_price: '', max_price: '', bedrooms: '', furnishing: '', sort: 'newest' })}
                  className="w-full text-sm text-primary-600 font-medium py-2 hover:text-primary-700">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}
                  className="card-glass overflow-hidden group hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">{property.property_type === 'apartment' ? '🏢' : property.property_type === 'villa' ? '🏡' : property.property_type === 'plot' ? '📐' : property.property_type === 'office_space' ? '💼' : '🏠'}</span>
                    </div>
                    {/* Tags */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {property.is_featured && (
                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-lg">Featured</span>
                      )}
                      {property.is_premium && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-lg">Premium</span>
                      )}
                    </div>
                    {/* AI Score */}
                    {property.ai_investment_score && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                        AI Score: {property.ai_investment_score}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 capitalize px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded">
                        {property.property_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                    </div>

                    <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                      {property.title}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                      {property.locality}, {property.city}
                    </p>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {property.bedrooms && <span>{property.bedrooms} BHK</span>}
                      {property.bathrooms && <span>{property.bathrooms} Bath</span>}
                      <span>{property.area_sqft.toLocaleString()} sqft</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-display text-xl font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(property.price)}
                      </span>
                      {property.listing_type === 'rent' && <span className="text-sm text-gray-500">/month</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
