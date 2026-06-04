import React from 'react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '12,450', icon: '👥', change: '+350', color: 'text-blue-600' },
    { label: 'Total Properties', value: '8,920', icon: '🏘️', change: '+120', color: 'text-green-600' },
    { label: 'Pending Approvals', value: '45', icon: '⏳', change: '-8', color: 'text-yellow-600' },
    { label: 'Revenue', value: '₹12.5L', icon: '💰', change: '+15%', color: 'text-purple-600' },
    { label: 'Active Agents', value: '234', icon: '🤝', change: '+12', color: 'text-indigo-600' },
    { label: 'Monthly Visits', value: '5.2L', icon: '📊', change: '+22%', color: 'text-pink-600' },
  ];

  const pendingProperties = [
    { id: 10, title: '3BHK in Koramangala', seller: 'Vikram Shah', city: 'Bengaluru', price: '₹1.8 Cr', submitted: '2 hours ago' },
    { id: 11, title: 'Villa in Anna Nagar', seller: 'Lakshmi R', city: 'Chennai', price: '₹3.2 Cr', submitted: '5 hours ago' },
    { id: 12, title: 'Plot in Dwarka', seller: 'Rajan M', city: 'Delhi', price: '₹85 L', submitted: '1 day ago' },
  ];

  const recentUsers = [
    { name: 'Arun Kumar', email: 'arun@gmail.com', role: 'buyer', joined: '1 hour ago' },
    { name: 'Sneha Reddy', email: 'sneha@gmail.com', role: 'seller', joined: '3 hours ago' },
    { name: 'PropMax Realty', email: 'propmax@mail.com', role: 'agent', joined: '1 day ago' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">InfyNest AI Platform Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card-glass p-4">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className={`text-xs font-semibold mt-1 ${stat.color}`}>{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">Pending Approvals</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                {pendingProperties.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {pendingProperties.map((prop) => (
                <div key={prop.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{prop.title}</p>
                      <p className="text-xs text-gray-500">{prop.seller} • {prop.city} • {prop.price}</p>
                    </div>
                    <span className="text-xs text-gray-400">{prop.submitted}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
                      Reject
                    </button>
                    <button className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-300 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card-glass p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full capitalize ${
                      u.role === 'buyer' ? 'bg-blue-100 text-blue-700' : u.role === 'seller' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>{u.role}</span>
                    <p className="text-xs text-gray-400 mt-1">{u.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Chart Placeholder */}
          <div className="card-glass p-6 lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Platform Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Top Cities</h3>
                <div className="space-y-2">
                  {['Mumbai (2,400)', 'Bengaluru (1,800)', 'Delhi NCR (2,100)', 'Hyderabad (1,200)'].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 dark:text-blue-400">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">Property Types</h3>
                <div className="space-y-2">
                  {['Apartments (45%)', 'Villas (20%)', 'Plots (18%)', 'Commercial (17%)'].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-400">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl">
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">User Growth</h3>
                <div className="space-y-2">
                  {['Jan: +1,200', 'Feb: +1,450', 'Mar: +1,800', 'Apr: +2,100'].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-purple-700 dark:text-purple-400">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
