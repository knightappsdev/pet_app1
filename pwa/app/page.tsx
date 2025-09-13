'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { 
  HeartIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserIcon
} from '@heroicons/react/24/outline'

// Mock data - will be replaced with API calls
const mockPets = [
  {
    id: 1,
    name: 'Bella',
    type: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face',
    nextAppointment: 'Vaccination due in 2 days',
    healthStatus: 'excellent'
  },
  {
    id: 2,
    name: 'Whiskers',
    type: 'Cat',
    breed: 'British Shorthair',
    age: '5 years',
    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face',
    nextAppointment: 'Check-up scheduled',
    healthStatus: 'good'
  }
]

const quickActions = [
  {
    title: 'Book Services',
    description: 'Dog walkers, sitters & more',
    icon: CalendarDaysIcon,
    href: '/services',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Pet Health',
    description: 'Medical records & vets',
    icon: HeartIcon,
    href: '/health',
    color: 'bg-red-500',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    title: 'Community',
    description: 'Connect with pet owners',
    icon: UserGroupIcon,
    href: '/community',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Pet Shop',
    description: 'Food, toys & supplies',
    icon: ShoppingBagIcon,
    href: '/shop',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    title: 'Adoption',
    description: 'Find your new friend',
    icon: HomeIcon,
    href: '/adoption',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Emergency',
    description: '24/7 vet services',
    icon: ExclamationTriangleIcon,
    href: '/emergency',
    color: 'bg-red-600',
    gradient: 'from-red-600 to-red-700'
  }
]

const upcomingReminders = [
  {
    id: 1,
    title: "Bella's Vaccination",
    time: 'Tomorrow at 2:00 PM',
    type: 'health',
    urgent: true
  },
  {
    id: 2,
    title: 'Dog Walker - Max',
    time: 'Today at 4:00 PM',
    type: 'service',
    urgent: false
  },
  {
    id: 3,
    title: 'Food Delivery',
    time: 'Thursday',
    type: 'delivery',
    urgent: false
  }
]

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Initialize client-side state to avoid hydration mismatch
    setMounted(true)
    setCurrentTime(new Date())
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(timer)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const greeting = () => {
    if (!mounted || !currentTime) return 'Welcome'
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500'
      case 'good': return 'bg-yellow-500'
      default: return 'bg-red-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm font-medium">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting()}{isAuthenticated && user ? `, ${user.firstName}` : ''}! 👋
              </h1>
              <p className="text-gray-600 text-sm" suppressHydrationWarning={true}>
                {mounted && currentTime ? (
                  currentTime.toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                ) : (
                  'Loading date...'
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              {isAuthenticated ? (
                <Link href="/profile" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                  <UserIcon className="h-6 w-6" />
                </Link>
              ) : (
                <Link href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* My Pets Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Pets</h2>
            <Link 
              href="/pets" 
              className="flex items-center space-x-1 bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
            >
              <span>Manage Pets</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockPets.map((pet) => (
              <Link 
                key={pet.id} 
                href="/pets"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Image
                      src={pet.photo}
                      alt={pet.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getHealthStatusColor(pet.healthStatus)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                    <p className="text-xs text-blue-600 mt-1 truncate">{pet.nextAppointment}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming Reminders */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${reminder.urgent ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">{reminder.time}</p>
                    </div>
                  </div>
                  {reminder.urgent && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location Quick Access */}
        <section>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Find Nearby Services</h2>
                <p className="text-blue-100 text-sm mb-4">Discover pet services in your area</p>
                <Link 
                  href="/services/nearby"
                  className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Find Services</span>
                </Link>
              </div>
              <div className="hidden sm:block opacity-20">
                <MapPinIcon className="h-20 w-20" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center space-y-1 py-2 px-3 text-blue-500">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/pets" className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-500">
            <HeartIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Pets</span>
          </Link>
          <Link href="/services" className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-500">
            <CalendarDaysIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Services</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-500">
            <UserGroupIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Community</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 py-2 px-3 text-gray-600 hover:text-blue-500">
            <UserIcon className="h-6 w-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}