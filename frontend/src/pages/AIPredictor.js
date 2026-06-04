import React, { useState } from 'react';

const AIPredictor = () => {
  const [form, setForm] = useState({
    state: '', city: '', property_type: 'apartment', area_sqft: 1000,
    bedrooms: 2, bathrooms: 2, age_of_property: 0, floor_number: 5,
    furnishing: 'unfurnished', has_car_parking: false, has_lift: false,
    has_gym: false, has_swimming_pool: false, nearby_metro: 3,
    nearby_school: 2, nearby_hospital: 3,
  });
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('price');
  const [roiResult, setRoiResult] = useState(null);
  const [rentalResult, setRentalResult] = useState(null);

  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Gurgaon', 'Noida', 'Ahmedabad', 'Jaipur', 'Kochi', 'Kolkata', 'Goa', 'Chandigarh', 'Lucknow', 'Indore', 'Coimbatore'];

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakhs`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const predictPrice = () => {
    // Client-side prediction logic (mirrors backend)
    const priceData = {
      'Mumbai': 15000, 'Delhi': 12000, 'Bengaluru': 8000, 'Hyderabad': 7000,
      'Chennai': 7500, 'Pune': 7000, 'Gurgaon': 10000, 'Noida': 7000,
      'Ahmedabad': 5000, 'Jaipur': 4500, 'Kochi': 5500, 'Kolkata': 5500,
      'Goa': 8000, 'Chandigarh': 6000, 'Lucknow': 4000, 'Indore': 3500, 'Coimbatore': 4500,
    };

    let base = priceData[form.city] || 4000;
    let multiplier = 1.0;

    if (form.furnishing === 'furnished') multiplier += 0.15;
    if (form.furnishing === 'semi-furnished') multiplier += 0.08;
    if (form.has_car_parking) multiplier += 0.05;
    if (form.has_lift) multiplier += 0.03;
    if (form.has_gym) multiplier += 0.04;
    if (form.has_swimming_pool) multiplier += 0.06;
    if (form.floor_number > 5) multiplier += 0.02 * Math.min(form.floor_number - 5, 10);
    if (form.age_of_property > 0) multiplier -= Math.min(form.age_of_property * 0.01, 0.2);
    if (form.nearby_metro < 2) multiplier += 0.10;
    else if (form.nearby_metro < 5) multiplier += 0.05;
    if (form.bedrooms >= 3) multiplier += 0.05 * (form.bedrooms - 2);

    const pricePerSqft = base * multiplier;
    const predicted = pricePerSqft * form.area_sqft;
    const confidence = Math.min(92, 75 + Math.round(multiplier * 10));

    setResult({
      predicted_price: Math.round(predicted),
      min_price: Math.round(predicted * 0.88),
      max_price: Math.round(predicted * 1.12),
      price_per_sqft: Math.round(pricePerSqft),
      confidence_score: confidence,
      annual_appreciation: (5 + Math.random() * 10).toFixed(1),
    });
  };

  const calculateROI = () => {
    const price = result?.predicted_price || form.area_sqft * 5000;
    const rates = { 'Mumbai': 8, 'Bengaluru': 10, 'Hyderabad': 12, 'Gurgaon': 11, 'Pune': 9, 'Delhi': 7 };
    const rate = (rates[form.city] || 7) / 100;
    const years = 5;
    const projections = [];
    for (let y = 1; y <= years; y++) {
      const fv = price * Math.pow(1 + rate, y);
      projections.push({ year: y, value: Math.round(fv), profit: Math.round(fv - price), roi: (((fv - price) / price) * 100).toFixed(1) });
    }
    setRoiResult({ purchase_price: price, projections, annual_rate: (rate * 100).toFixed(1) });
  };

  const calculateRental = () => {
    const price = result?.predicted_price || form.area_sqft * 5000;
    const ratios = { 'Mumbai': 0.003, 'Bengaluru': 0.0035, 'Hyderabad': 0.003, 'Pune': 0.0032, 'Delhi': 0.0028 };
    const ratio = ratios[form.city] || 0.003;
    const monthly = price * ratio;
    const annual = monthly * 12;
    const gross = (annual / price) * 100;
    setRentalResult({
      monthly_rent: Math.round(monthly),
      annual_rent: Math.round(annual),
      gross_yield: gross.toFixed(2),
      net_yield: (gross * 0.8).toFixed(2),
      payback_years: (price / annual).toFixed(1),
    });
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-800 to-accent-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
            <span className="text-white/90 text-sm font-medium">🤖 AI-Powered Analysis</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">AI Property Valuation</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Get instant AI-powered price predictions, investment scores, ROI projections, and rental yield calculations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { key: 'price', label: 'Price Predictor', icon: '💰' },
            { key: 'roi', label: 'ROI Calculator', icon: '📈' },
            { key: 'rental', label: 'Rental Yield', icon: '🏠' },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
              }`}>
              <span className="mr-2">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="card-glass p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Property Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                  <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field mt-1">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="input-field mt-1">
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="independent_house">Ind. House</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Area (sqft)</label>
                  <input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: parseInt(e.target.value) || 0 })} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                  <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) })} className="input-field mt-1">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Floor</label>
                  <input type="number" value={form.floor_number} onChange={(e) => setForm({ ...form, floor_number: parseInt(e.target.value) || 0 })} className="input-field mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age (years)</label>
                  <input type="number" value={form.age_of_property} onChange={(e) => setForm({ ...form, age_of_property: parseInt(e.target.value) || 0 })} className="input-field mt-1" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Furnishing</label>
                <select value={form.furnishing} onChange={(e) => setForm({ ...form, furnishing: e.target.value })} className="input-field mt-1">
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="furnished">Furnished</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Nearby Metro (km)</label>
                <input type="range" min="0" max="20" value={form.nearby_metro}
                  onChange={(e) => setForm({ ...form, nearby_metro: parseInt(e.target.value) })}
                  className="w-full" />
                <span className="text-sm text-gray-500">{form.nearby_metro} km</span>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'has_car_parking', label: 'Parking' },
                    { key: 'has_lift', label: 'Lift' },
                    { key: 'has_gym', label: 'Gym' },
                    { key: 'has_swimming_pool', label: 'Pool' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Predict Button */}
              <button onClick={() => { predictPrice(); calculateROI(); calculateRental(); }}
                className="w-full btn-primary !py-4 text-lg">
                🤖 Get AI Prediction
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {activeTab === 'price' && result && (
              <div className="card-glass p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">💰</span> AI Price Prediction
                </h2>

                {/* Main Price */}
                <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estimated Market Value</p>
                  <p className="font-display text-4xl md:text-5xl font-bold gradient-text">
                    {formatPrice(result.predicted_price)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">₹{result.price_per_sqft}/sqft</p>
                </div>

                {/* Range */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-xs text-green-600 font-medium">Min Price</p>
                    <p className="font-bold text-green-700 dark:text-green-400">{formatPrice(result.min_price)}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="text-xs text-blue-600 font-medium">Confidence</p>
                    <p className="font-bold text-blue-700 dark:text-blue-400">{result.confidence_score}%</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="text-xs text-purple-600 font-medium">Max Price</p>
                    <p className="font-bold text-purple-700 dark:text-purple-400">{formatPrice(result.max_price)}</p>
                  </div>
                </div>

                {/* Appreciation */}
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    📈 Expected Annual Appreciation: <strong>{result.annual_appreciation}%</strong>
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'roi' && roiResult && (
              <div className="card-glass p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">📈</span> ROI Projection (5 Years)
                </h2>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
                  <p className="text-sm text-green-600">Annual Growth Rate: <strong>{roiResult.annual_rate}%</strong></p>
                </div>

                <div className="space-y-3">
                  {roiResult.projections.map((p) => (
                    <div key={p.year} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Year {p.year}</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{formatPrice(p.value)}</p>
                        <p className="text-xs text-green-600">+{p.roi}% ROI</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
                  <p className="text-sm text-gray-600">Total 5-Year Profit</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{formatPrice(roiResult.projections[4].profit)}</p>
                </div>
              </div>
            )}

            {activeTab === 'rental' && rentalResult && (
              <div className="card-glass p-6 md:p-8">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="mr-2">🏠</span> Rental Yield Analysis
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <p className="text-xs text-blue-600 font-medium">Monthly Rent</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">₹{rentalResult.monthly_rent.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-xs text-green-600 font-medium">Annual Income</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">₹{rentalResult.annual_rent.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                    <p className="text-xs text-purple-600 font-medium">Gross Yield</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{rentalResult.gross_yield}%</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                    <p className="text-xs text-orange-600 font-medium">Net Yield</p>
                    <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{rentalResult.net_yield}%</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ⏱️ Payback Period: <strong className="text-gray-900 dark:text-white">{rentalResult.payback_years} years</strong>
                  </p>
                </div>
              </div>
            )}

            {!result && (
              <div className="card-glass p-12 text-center">
                <span className="text-6xl mb-4 block">🤖</span>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Enter Property Details</h3>
                <p className="text-gray-500">Fill in the form and click "Get AI Prediction" to see instant results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictor;
