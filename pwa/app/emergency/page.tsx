'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ExclamationTriangleIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  BookOpenIcon,
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { api, EmergencyService, EmergencyRequest, EmergencyContact, FirstAidGuide } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function EmergencyPage() {
  const { user } = useAuth()
  const [nearbyServices, setNearbyServices] = useState<EmergencyService[]>([])
  const [myRequests, setMyRequests] = useState<EmergencyRequest[]>([])
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [firstAidGuides, setFirstAidGuides] = useState<FirstAidGuide[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    getCurrentLocation()
  }, [])

  const getCurrentLocation = async () => {
    try {
      const location = await api.emergency.getCurrentLocation()
      setUserLocation(location.coordinates)
      // Load nearby services once we have location
      const services = await api.emergency.getNearbyServices(location.coordinates, 25)
      setNearbyServices(services)
    } catch (error) {
      console.error('Failed to get location:', error)
      setLocationError('Unable to access location. Please enable location services.')
      // Still load some default services
      const defaultServices = await api.emergency.getServices()
      setNearbyServices(defaultServices.services.slice(0, 3))
    }
  }

  const loadData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const [requestsData, contactsData, guidesData] = await Promise.all([
        api.emergency.getMyRequests('submitted'),
        api.emergency.getContacts(),
        api.emergency.getFirstAidGuides()
      ])

      setMyRequests(requestsData)
      setContacts(contactsData)
      setFirstAidGuides(guidesData.slice(0, 4)) // Show first 4 guides
    } catch (error) {
      console.error('Failed to load emergency data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmergencyCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const getServiceDistance = (service: EmergencyService): string => {
    if (!userLocation || !service.location?.coordinates) return ''
    
    const distance = api.emergency.calculateDistance(
      userLocation,
      service.location.coordinates
    )
    
    return `${distance.toFixed(1)}km away`
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Emergency Services</h1>
          </div>
          <p className="text-red-100">
            Get immediate help for your pet in emergency situations
          </p>
          
          {locationError && (
            <div className="mt-3 bg-red-700 p-3 rounded-lg">
              <p className="text-sm">{locationError}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/emergency/request"
            className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl text-center transition-colors"
          >
            <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Emergency Request</h3>
            <p className="text-sm text-red-100">Get immediate help</p>
          </Link>

          <button
            onClick={() => handleEmergencyCall('0800-1234567')}
            className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-xl text-center transition-colors"
          >
            <PhoneIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Emergency Hotline</h3>
            <p className="text-sm text-orange-100">24/7 advice line</p>
          </button>

          <Link
            href="/emergency/first-aid"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center transition-colors"
          >
            <HeartIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">First Aid</h3>
            <p className="text-sm text-blue-100">Emergency guides</p>
          </Link>

          <Link
            href="/emergency/poison"
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl text-center transition-colors"
          >
            <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Poison Info</h3>
            <p className="text-sm text-purple-100">Toxicity database</p>
          </Link>
        </div>

        {/* Active Emergency Requests */}
        {user && myRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-600" />
              Active Emergency Requests
            </h2>
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div
                  key={request._id}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(request.emergency.severity)}`}>
                        {request.emergency.severity.toUpperCase()}
                      </span>
                      <h3 className="font-medium text-gray-900 mt-1">
                        {request.emergency.type}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      request.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'treating' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {request.emergency.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                    <Link
                      href={`/emergency/requests/${request._id}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Nearby Emergency Services */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-blue-600" />
                Nearby Services
              </h2>
              <Link
                href="/emergency/services"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {nearbyServices.length > 0 ? (
                nearbyServices.map((service) => (
                  <div
                    key={service._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.type}</p>
                      </div>
                      <div className="text-right">
                        {service.isAvailable24h && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            24/7
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{service.location?.address?.line1}, {service.location?.address?.city}</span>
                      {userLocation && (
                        <span className="ml-2 text-blue-600 font-medium">
                          {getServiceDistance(service)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span className={`font-medium ${
                          service.currentStatus === 'open' ? 'text-green-600' : 
                          service.currentStatus === 'busy' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {service.currentStatus === 'open' ? 'Open Now' : 
                           service.currentStatus === 'busy' ? 'Busy' : 'Closed'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleEmergencyCall(service.contact.phone)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Call Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No nearby services found</p>
                  <Link
                    href="/emergency/services"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Search all services
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Resources */}
          <div className="space-y-6">
            {/* First Aid Guides */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-green-600" />
                  First Aid Guides
                </h2>
                <Link
                  href="/emergency/first-aid"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {firstAidGuides.length > 0 ? (
                  firstAidGuides.map((guide) => (
                    <Link
                      key={guide._id}
                      href={`/emergency/first-aid/${guide._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{guide.steps?.[0]?.description || 'Emergency first aid guide'}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="capitalize">{guide.category}</span>
                        <span>{guide.species.join(', ')}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <BookOpenIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No guides available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contacts */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Emergency Contacts
                  </h2>
                  <Link
                    href="/emergency/contacts"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <PlusIcon className="h-4 w-4 inline mr-1" />
                    Add Contact
                  </Link>
                </div>

                <div className="space-y-3">
                  {contacts.length > 0 ? (
                    contacts.slice(0, 3).map((contact) => (
                      <div
                        key={contact._id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.relationship}</p>
                        </div>
                        <button
                          onClick={() => handleEmergencyCall(contact.phone)}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                        >
                          Call
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <UserGroupIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm mb-3">No emergency contacts</p>
                      <Link
                        href="/emergency/contacts"
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        Add your first contact
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-600" />
            Quick Search
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/emergency/services?type=veterinary_hospital"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <h3 className="font-medium text-gray-900">Vet Hospitals</h3>
            </Link>
            <Link
              href="/emergency/services?type=emergency_clinic"
              className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-center"
            >
              <h3 className="font-medium text-gray-900">Emergency Clinics</h3>
            </Link>
            <Link
              href="/emergency/poison"
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
            >
              <h3 className="font-medium text-gray-900">Poison Control</h3>
            </Link>
            <Link
              href="/emergency/first-aid?category=choking"
              className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
            >
              <h3 className="font-medium text-gray-900">Choking Guide</h3>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}