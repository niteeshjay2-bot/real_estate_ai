import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const AgentDashboard = () => {
  const { user } = useContext(AuthContext);

  const stats = [
    { label: 'Managed Properties', value: '24', icon: '🏘️' },
    { label: 'Active Clients', value: '15', icon: '👥' },
    { label: 'Scheduled Visits', value: '7', icon: '📅' },
    { label: 'This Month Revenue', value: '₹4.2L', icon: '💰' },
  ];

  const upcomingVisits = [
    { client: 'Rahul Sharma', property: '3BHK Bandra', date: 'Today, 4:00 PM', status: 'confirmed' },
    { client: 'Priya Patel', property: 'Villa Whitefield', date: 'Tomorrow, 11:00 AM', status: 'confirmed' },
    { client: 'Amit Kumar', property: '2BHK Hinjewadi', date: 'Jan 20, 2:00 PM', status: 'pending' },
  ];

  const clients = [
    { name: 'Rahul Sharma', budget: '₹1-2 Cr', looking: '3BHK Mumbai', status: 'active' },
    { name: 'Priya Patel', budget: '₹2-3 Cr', looking: 'Villa Bengaluru', status: 'active' },
    { name: 'Suresh Gupta', budget: '₹50-80 L', looking: '2BHK Pune', status: 'closed' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-dark-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user?.first_name || 'Agent'}</p>
          </div>
          <Link to="/add-property" className="btn-primary">+ Add Listing</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card-glass p-5">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Visits */}
          <div className="card-glass p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Visits</h2>
            <div className="space-y-3">
              {upcomingVisits.map((visit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{visit.client}</p>
                    <p className="text-sm text-gray-500">{visit.property} • {visit.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    visit.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{visit.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clients */}
          <div className="card-glass p-6">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4">My Clients</h2>
            <div className="space-y-3">
              {clients.map((client, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                      {client.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.looking} • {client.budget}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    client.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{client.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
