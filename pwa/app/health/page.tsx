'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { api, PetProfile, HealthRecord, VaccinationRecord } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function HealthPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState<PetProfile[]>([])
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<VaccinationRecord[]>([])
  const [healthReminders, setHealthReminders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      loadHealthData()
    }
  }, [user])

  useEffect(() => {
    if (selectedPetId) {
      loadPetHealthData(selectedPetId)
    }
  }, [selectedPetId])

  const loadHealthData = async () => {
    try {
      const petsData = await api.pets.getMyPets()
      setPets(petsData)
      
      if (petsData.length > 0) {
        setSelectedPetId(petsData[0].id)
      }

      // Load health reminders
      const remindersData = await api.health.getUpcomingReminders()
      setHealthReminders(remindersData)
      
    } catch (error) {
      console.error('Failed to load health data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPetHealthData = async (petId: string) => {
    try {
      const [recordsData, vaccinationsData] = await Promise.all([
        api.health.getHealthRecords(petId),
        api.health.getUpcomingVaccinations(petId)
      ])
      
      setHealthRecords(recordsData)
      setUpcomingVaccinations(vaccinationsData)
    } catch (error) {
      console.error('Failed to load pet health data:', error)
    }
  }

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return 'bg-green-100 text-green-800'
      case 'illness': return 'bg-red-100 text-red-800'
      case 'injury': return 'bg-orange-100 text-orange-800'
      case 'surgery': return 'bg-purple-100 text-purple-800'
      case 'medication': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVaccinationStatus = (vaccination: VaccinationRecord) => {
    if (!vaccination.nextDueDate) {
      return { status: 'no_date', color: 'bg-gray-100 text-gray-800', text: 'No Due Date' }
    }
    
    const today = new Date()
    const nextDue = new Date(vaccination.nextDueDate)
    const daysDiff = Math.floor((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 0) return { status: 'overdue', color: 'bg-red-100 text-red-800', text: 'Overdue' }
    if (daysDiff <= 30) return { status: 'due_soon', color: 'bg-yellow-100 text-yellow-800', text: 'Due Soon' }
    return { status: 'up_to_date', color: 'bg-green-100 text-green-800', text: 'Up to Date' }
  }

  const selectedPet = pets.find(pet => pet.id === selectedPetId)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading health data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Tracking</h2>
          <p className="text-gray-600 mb-6">Please log in to access pet health features</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pets Found</h2>
          <p className="text-gray-600 mb-6">Add your first pet to start tracking their health</p>
          <Link
            href="/pets"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Add Pet
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <HeartIcon className="h-8 w-8 text-red-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Health Tracking</h1>
                <p className="text-gray-600">Monitor your pets' health and wellness</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Pet Selector */}
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
              
              <Link
                href="/health/add-record"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Record</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pet Health Overview Card */}
        {selectedPet && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {selectedPet.photos && selectedPet.photos.length > 0 ? (
                    <img
                      src={selectedPet.photos[0]}
                      alt={selectedPet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <HeartIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPet.name}</h2>
                  <p className="text-gray-600">
                    {selectedPet.breed} • {selectedPet.species} • 
                    {selectedPet.dateOfBirth && (
                      ` ${Math.floor((Date.now() - new Date(selectedPet.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old`
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedPet.isVaccinated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedPet.isVaccinated ? 'Vaccinated' : 'Needs Vaccination'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedPet.isNeutered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedPet.isNeutered ? 'Neutered' : 'Not Neutered'}
                </span>
              </div>
            </div>

            {/* Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Health Records</p>
                    <p className="text-2xl font-bold text-green-900">{healthRecords.length}</p>
                  </div>
                  <DocumentTextIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Vaccinations</p>
                    <p className="text-2xl font-bold text-blue-900">{upcomingVaccinations.length}</p>
                  </div>
                  <HeartIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Reminders</p>
                    <p className="text-2xl font-bold text-yellow-900">{healthReminders.length}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Weight</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedPet.weight || 'N/A'}</p>
                  </div>
                  <ChartBarIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: HeartIcon },
              { id: 'records', name: 'Health Records', icon: DocumentTextIcon },
              { id: 'vaccinations', name: 'Vaccinations', icon: CalendarIcon },
              { id: 'reminders', name: 'Reminders', icon: ClockIcon },
            ].map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Health Records */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Health Records</h3>
                  <Link
                    href="/health/records"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {healthRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{record.diagnosis || record.treatment || 'Health Record'}</p>
                        <p className="text-sm text-gray-600">{record.vetName} • {new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  
                  {healthRecords.length === 0 && (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No health records yet</p>
                      <Link
                        href="/health/add-record"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Add your first record
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Vaccinations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Vaccinations</h3>
                  <Link
                    href="/health/vaccinations"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {upcomingVaccinations.slice(0, 3).map((vaccination) => {
                    const statusInfo = getVaccinationStatus(vaccination)
                    return (
                      <div key={vaccination.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{vaccination.vaccineName}</p>
                          <p className="text-sm text-gray-600">Due: {vaccination.nextDueDate ? new Date(vaccination.nextDueDate).toLocaleDateString() : 'Not scheduled'}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    )
                  })}
                  
                  {upcomingVaccinations.length === 0 && (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No vaccination schedule available</p>
                      <Link
                        href="/health/vaccinations"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Set up vaccination schedule
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Health Records Tab */}
          {activeTab === 'records' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                      <FunnelIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href="/health/add-record"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Add Record</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {healthRecords.map((record) => (
                  <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRecordTypeColor(record.type)}`}>
                            {record.type}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {record.diagnosis || record.treatment || 'Health Record'}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Date:</span> {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Vet:</span> {record.vetName || 'Not specified'}
                            </div>
                            {record.vetClinic && (
                              <div>
                                <span className="font-medium">Clinic:</span> {record.vetClinic}
                              </div>
                            )}
                            {record.cost && (
                              <div>
                                <span className="font-medium">Cost:</span> £{record.cost}
                              </div>
                            )}
                          </div>
                          {record.notes && (
                            <p className="mt-2 text-gray-700">{record.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {healthRecords.length === 0 && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Health Records</h4>
                    <p className="text-gray-600 mb-6">Start tracking your pet's health by adding their first record</p>
                    <Link
                      href="/health/add-record"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Add Health Record</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vaccinations Tab */}
          {activeTab === 'vaccinations' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Vaccination Schedule</h3>
                  <Link
                    href="/health/add-vaccination"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Vaccination</span>
                  </Link>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {upcomingVaccinations.map((vaccination) => {
                  const statusInfo = getVaccinationStatus(vaccination)
                  return (
                    <div key={vaccination.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{vaccination.vaccineName}</h4>
                          <p className="text-gray-600">Next due: {vaccination.nextDueDate ? new Date(vaccination.nextDueDate).toLocaleDateString() : 'Not scheduled'}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Last Given:</span> {new Date(vaccination.dateGiven).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Vet:</span> {vaccination.vetName}
                        </div>
                        <div>
                          <span className="font-medium">Batch No:</span> {vaccination.batchNumber || 'N/A'}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {upcomingVaccinations.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Vaccination Schedule</h4>
                    <p className="text-gray-600 mb-6">Keep your pet healthy by setting up their vaccination schedule</p>
                    <Link
                      href="/health/add-vaccination"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Add Vaccination Record</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === 'reminders' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Health Reminders</h3>
                  <Link
                    href="/health/add-reminder"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Reminder</span>
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center py-12">
                  <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Reminders</h4>
                  <p className="text-gray-600 mb-6">Set up reminders for medications, checkups, and important health events</p>
                  <Link
                    href="/health/add-reminder"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Create Reminder</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}