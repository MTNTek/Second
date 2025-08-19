/**
 * User Dashboard Component
 * Perry Eden Group - Professional Services Platform
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../src/context/AuthContext';

interface Application {
  id: string;
  type: string;
  serviceName: string;
  status: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  totalSpent: number;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-purple-100 text-purple-800',
};

const serviceIcons = {
  travel: '✈️',
  visa: '🛂',
  work_permit: '💼',
  uae_job: '🏢',
  document: '📄',
  contact: '📞',
};

export default function UserDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'payments' | 'profile'>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalSpent: 0,
  });
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoadingData(true);
    setError(null);

    try {
      // For now, just show empty state
      setApplications([]);
      setPayments([]);
      setStats({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        totalSpent: 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoadingData(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access your dashboard.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
              <p className="text-gray-600 mt-1">Manage your applications and profile</p>
            </div>
            <button
              onClick={fetchUserData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'applications', name: 'Applications', icon: '📋' },
              { id: 'payments', name: 'Payments', icon: '💳' },
              { id: 'profile', name: 'Profile', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalSpent)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Getting Started Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome to Your Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Get started by applying for our services. Once you submit applications, they'll appear here for tracking.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">✈️</div>
                  <h4 className="font-medium text-gray-900">Travel Services</h4>
                  <p className="text-sm text-gray-600 mt-1">Book flights, hotels, and travel packages</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">🛂</div>
                  <h4 className="font-medium text-gray-900">Visa Services</h4>
                  <p className="text-sm text-gray-600 mt-1">Apply for various visa types</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl mb-2">💼</div>
                  <h4 className="font-medium text-gray-900">Work Permits</h4>
                  <p className="text-sm text-gray-600 mt-1">Get assistance with work permits</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content */}
        {activeTab === 'applications' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Applications</h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Start by applying for our services to see them here.</p>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-600">Your payment history will appear here once you make transactions.</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="mt-1 text-sm text-gray-900">{user.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1 text-sm text-gray-900">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <div className="mt-1 text-sm text-gray-900">{user.role}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <div className="mt-1 text-sm text-gray-900">
                    {user.createdAt ? formatDate(user.createdAt) : 'Recently joined'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
