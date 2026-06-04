import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { label: 'Saved Properties', value: '12', icon: '❤️', color: 'bg-red-50 text-red-700' },
    { label: 'Scheduled Visits', value: '3', icon: '📅', color: 'bg-blue-50 text-blue-700' },
    { label: 'Recommendations', value: '8', icon: '🤖', color: 'bg-purple-50 text-purple-700' },
    { label: 'Comparisons', value: '5', icon: '⚖️', color: 'bg-green-50 text-green-700' },
  ];

  const savedProperties = [
    { id: 1, title: '3BHK Bandra West', city: 'Mumbai', price: '₹3.5 Cr', score: 87 },
    { id: 2, title: '4BHK Villa Whitefield', city: 'Bengaluru', price: '₹2.5 Cr', score: 82 },
    { id: 3, title: '2BHK Hinjewadi', city: 'Pune', price: '₹75 L', score: 79 },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.first_name || 'Buyer'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Here's your personalized property dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card-glass p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Saved Properties */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Saved Properties</h2>
              <Link to="/properties" className="text-sm text-primary-600 font-medium">View All →</Link>
            </div>
            <div className="space-y-3">
              {savedProperties.map((p) => (
                <Link key={p.id} to={`/properties/${p.id}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-xl">🏢</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                      <p className="text-sm text-gray-500">{p.city} • {p.price}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">{p.score}/100</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-glass p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/properties" className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center hover:bg-primary-100 transition-colors">
                <span className="text-2xl block mb-2">🔍</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Properties</span>
              </Link>
              <Link to="/ai-predictor" className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl text-center hover:bg-accent-100 transition-colors">
                <span className="text-2xl block mb-2">🤖</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Predictor</span>
              </Link>
              <Link to="/compare" className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center hover:bg-green-100 transition-colors">
                <span className="text-2xl block mb-2">⚖️</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compare</span>
              </Link>
              <Link to="/properties" className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center hover:bg-yellow-100 transition-colors">
                <span className="text-2xl block mb-2">📍</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Map View</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
