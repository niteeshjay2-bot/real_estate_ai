import React, { useState } from 'react';

const ComparePage = () => {
  const [selectedIds] = useState([1, 2, 4]);

  // Demo compare data
  const properties = [
    { id: 1, title: '3BHK Bandra West', city: 'Mumbai', price: 35000000, area: 1800, bedrooms: 3, bathrooms: 3, floor: 15, age: 2, furnishing: 'Furnished', parking: true, gym: true, pool: true, lift: true, ai_score: 87, price_sqft: 19444 },
    { id: 2, title: '4BHK Villa Whitefield', city: 'Bengaluru', price: 25000000, area: 3200, bedrooms: 4, bathrooms: 4, floor: 0, age: 3, furnishing: 'Semi-Furnished', parking: true, gym: false, pool: true, lift: false, ai_score: 82, price_sqft: 7812 },
    { id: 4, title: '2BHK Hinjewadi', city: 'Pune', price: 7500000, area: 950, bedrooms: 2, bathrooms: 2, floor: 7, age: 1, furnishing: 'Semi-Furnished', parking: true, gym: false, pool: false, lift: true, ai_score: 79, price_sqft: 7894 },
  ];

  const formatPrice = (p) => p >= 10000000 ? `₹${(p/10000000).toFixed(2)} Cr` : `₹${(p/100000).toFixed(0)} L`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="bg-gradient-to-r from-primary-700 to-accent-700 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Compare Properties</h1>
          <p className="text-white/80 mt-2">Side-by-side comparison with AI insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-4 text-gray-600 dark:text-gray-400 font-medium">Feature</th>
                {properties.map(p => (
                  <th key={p.id} className="p-4">
                    <div className="card-glass p-4 text-center">
                      <span className="text-3xl mb-2 block">🏢</span>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{p.title}</h3>
                      <p className="text-xs text-gray-500">{p.city}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { label: 'Price', render: (p) => <span className="font-bold text-primary-600">{formatPrice(p.price)}</span> },
                { label: 'Area', render: (p) => `${p.area.toLocaleString()} sqft` },
                { label: 'Price/sqft', render: (p) => `₹${p.price_sqft.toLocaleString()}` },
                { label: 'Bedrooms', render: (p) => `${p.bedrooms} BHK` },
                { label: 'Bathrooms', render: (p) => p.bathrooms },
                { label: 'Floor', render: (p) => p.floor || 'Ground' },
                { label: 'Age', render: (p) => `${p.age} years` },
                { label: 'Furnishing', render: (p) => p.furnishing },
                { label: 'Parking', render: (p) => p.parking ? '✅' : '❌' },
                { label: 'Gym', render: (p) => p.gym ? '✅' : '❌' },
                { label: 'Pool', render: (p) => p.pool ? '✅' : '❌' },
                { label: 'Lift', render: (p) => p.lift ? '✅' : '❌' },
                { label: 'AI Score', render: (p) => (
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    p.ai_score >= 85 ? 'bg-green-100 text-green-700' : p.ai_score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>{p.ai_score}/100</span>
                )},
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{row.label}</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-4 text-center text-gray-900 dark:text-white">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
