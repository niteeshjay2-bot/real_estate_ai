import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { label: 'Total Listings', value: '8', icon: '🏠', trend: '+2 this month' },
    { label: 'Active Listings', value: '5', icon: '✅', trend: '3 pending' },
    { label: 'Total Views', value: '2,450', icon: '👁️', trend: '+320 this week' },
    { label: 'Inquiries', value: '67', icon: '📩', trend: '+12 new' },
  ];

  const myListings = [
    { id: 1, title: '3BHK Bandra West', status: 'approved', views: 450, inquiries: 12, price: '₹3.5 Cr' },
    { id: 2, title: '2BHK Powai', status: 'approved', views: 280, inquiries: 8, price: '₹1.8 Cr' },
    { id: 3, title: 'Plot in Noida', status: 'pending', views: 0, inquiries: 0, price: '₹45 L' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Seller Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your property listings</p>
          </div>
          <Link to="/add-property" className="btn-primary">+ List Property</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card-glass p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="card-glass p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">My Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Property</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Views</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Inquiries</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="p-3 font-medium text-gray-900 dark:text-white">{listing.title}</td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{listing.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        listing.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{listing.status}</span>
                    </td>
                    <td className="p-3 text-gray-600">{listing.views}</td>
                    <td className="p-3 text-gray-600">{listing.inquiries}</td>
                    <td className="p-3">
                      <button className="text-primary-600 text-sm font-medium hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
