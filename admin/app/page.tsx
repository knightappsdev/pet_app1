'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Mock data for dashboard
const statsData = {
  totalUsers: 15847,
  activeUsers: 12456,
  totalPets: 18392,
  totalServices: 1284,
  totalBookings: 3456,
  revenue: 89450,
  pendingApprovals: 23,
  emergencyRequests: 5
}

const chartData = [
  { name: 'Jan', users: 1200, revenue: 8500, bookings: 245 },
  { name: 'Feb', users: 1350, revenue: 9200, bookings: 289 },
  { name: 'Mar', users: 1100, revenue: 7800, bookings: 201 },
  { name: 'Apr', users: 1580, revenue: 11200, bookings: 356 },
  { name: 'May', users: 1890, revenue: 13400, bookings: 445 },
  { name: 'Jun', users: 2100, revenue: 15600, bookings: 523 }
]

const serviceDistribution = [
  { name: 'Dog Walking', value: 35, color: '#3b82f6' },
  { name: 'Pet Sitting', value: 28, color: '#10b981' },
  { name: 'Grooming', value: 20, color: '#f59e0b' },
  { name: 'Training', value: 12, color: '#ef4444' },
  { name: 'Veterinary', value: 5, color: '#8b5cf6' }
]

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, current: true },
  { name: 'Users', href: '/users', icon: UserGroupIcon, current: false },
  { name: 'Service Providers', href: '/providers', icon: ClipboardDocumentListIcon, current: false },
  { name: 'Pets', href: '/pets', icon: HeartIcon, current: false },
  { name: 'Bookings', href: '/bookings', icon: MapPinIcon, current: false },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon, current: false },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon, current: false },
  { name: 'Settings', href: '/settings', icon: CogIcon, current: false }
]

const recentActivity = [
  {
    id: 1,
    type: 'user_registration',
    message: 'New user Sarah Johnson registered',
    time: '2 minutes ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'service_booking',
    message: 'Dog walking service booked by Mike Wilson',
    time: '15 minutes ago',
    status: 'info'
  },
  {
    id: 3,
    type: 'provider_application',
    message: 'New service provider application from Emma Davis',
    time: '1 hour ago',
    status: 'warning'
  },
  {
    id: 4,
    type: 'emergency_request',
    message: 'Emergency vet request from location: Manchester',
    time: '2 hours ago',
    status: 'error'
  },
  {
    id: 5,
    type: 'payment_received',
    message: 'Payment of £45 received for booking #1234',
    time: '3 hours ago',
    status: 'success'
  }
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return UserGroupIcon
      case 'service_booking': return MapPinIcon
      case 'provider_application': return ClipboardDocumentListIcon
      case 'emergency_request': return ExclamationTriangleIcon
      case 'payment_received': return CheckCircleIcon
      default: return ClockIcon
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Pet Care</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-nav-item ${item.current ? 'active' : ''}`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@petcare.uk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>{statsData.pendingApprovals} pending approvals</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>{statsData.emergencyRequests} emergency requests</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{statsData.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{statsData.activeUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{statsData.totalBookings.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+23% from last month</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <MapPinIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">£{statsData.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+18% from last month</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Distribution Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}