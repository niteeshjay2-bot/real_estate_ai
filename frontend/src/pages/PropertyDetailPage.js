import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Demo property data
  const property = {
    id: parseInt(id),
    title: 'Luxury 3BHK Apartment in Bandra West',
    description: 'Experience luxury living in this premium sea-facing apartment with panoramic views of the Arabian Sea. This meticulously designed 3BHK features imported Italian marble flooring, modular kitchen with premium appliances, and floor-to-ceiling windows that flood the space with natural light.',
    property_type: 'apartment', listing_type: 'sale', status: 'approved',
    price: 35000000, price_per_sqft: 19444, area_sqft: 1800,
    carpet_area: 1500, built_up_area: 1800,
    bedrooms: 3, bathrooms: 3, balconies: 2,
    floor_number: 15, total_floors: 25, facing: 'West',
    age_of_property: 2, furnishing: 'furnished',
    state: 'Maharashtra', city: 'Mumbai', locality: 'Bandra West',
    address: 'Luxury Tower, Bandra West, Mumbai - 400050', pincode: '400050',
    amenities: { lift: true, car_parking: true, bike_parking: true, power_backup: true, security: true, gym: true, swimming_pool: true, club_house: true, cctv: true, garden: true },
    nearby: { school: 0.5, hospital: 1.2, metro: 0.8, airport: 15, mall: 2, bus_stop: 0.3 },
    ai_predicted_price: 37000000, ai_investment_score: 87, ai_confidence_score: 92,
    views_count: 1250, inquiries_count: 45, is_featured: true,
    owner_name: 'Premium Properties',
    created_at: '2024-01-15',
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const priceInsight = property.ai_predicted_price > property.price
    ? { text: `Undervalued by ${Math.round(((property.ai_predicted_price - property.price) / property.price) * 100)}%`, color: 'text-green-600', bg: 'bg-green-50' }
    : { text: `Overvalued by ${Math.round(((property.price - property.ai_predicted_price) / property.ai_predicted_price) * 100)}%`, color: 'text-red-600', bg: 'bg-red-50' };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/properties" className="text-gray-500 hover:text-primary-600">Properties</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Placeholder */}
            <div className="card-glass overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl">🏢</span>
                  <p className="text-gray-500 mt-4">Property Images</p>
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="card-glass p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-lg capitalize">
                      {property.property_type}
                    </span>
                    {property.is_featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-lg">Featured</span>
                    )}
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{property.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                    {property.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                  <p className="text-sm text-gray-500">₹{property.price_per_sqft?.toLocaleString()}/sqft</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="card-glass p-6">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">🤖</span> AI Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">AI Predicted Price</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatPrice(property.ai_predicted_price)}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Investment Score</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{property.ai_investment_score}/100</p>
                </div>
                <div className={`p-4 ${priceInsight.bg} dark:bg-opacity-20 rounded-xl`}>
                  <p className="text-sm text-gray-600 font-medium">Value Analysis</p>
                  <p className={`text-lg font-bold ${priceInsight.color}`}>{priceInsight.text}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card-glass overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['overview', 'amenities', 'nearby'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{property.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Bedrooms</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.bedrooms}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Bathrooms</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.bathrooms}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Area</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.area_sqft} sqft</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Floor</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.floor_number}/{property.total_floors}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Facing</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.facing}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.age_of_property} yrs</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Furnishing</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{property.furnishing}</p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-xs text-gray-500">Balconies</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{property.balconies}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(property.amenities).map(([key, value]) => (
                      <div key={key} className={`flex items-center space-x-2 p-3 rounded-xl ${value ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                        <span className={value ? 'text-green-500' : 'text-gray-400'}>
                          {value ? '✓' : '✗'}
                        </span>
                        <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                          {key.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'nearby' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(property.nearby).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <span className="text-lg">{key === 'school' ? '🏫' : key === 'hospital' ? '🏥' : key === 'metro' ? '🚇' : key === 'airport' ? '✈️' : key === 'mall' ? '🛍️' : '🚌'}</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{value} km</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="card-glass p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Owner</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.owner_name}</p>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
              </div>
              <button className="w-full btn-primary mb-3">Contact Now</button>
              <button className="w-full btn-secondary">Schedule Visit</button>
            </div>

            {/* Quick Stats */}
            <div className="card-glass p-6">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Views</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{property.views_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inquiries</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{property.inquiries_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Listed On</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{property.created_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confidence</span>
                  <span className="font-semibold text-green-600">{property.ai_confidence_score}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
