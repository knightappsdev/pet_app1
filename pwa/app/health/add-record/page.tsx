'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HeartIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PhotoIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { api, PetProfile, HealthRecord } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function AddHealthRecordPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [pets, setPets] = useState<PetProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    petId: '',
    type: 'checkup' as HealthRecord['type'],
    date: new Date().toISOString().split('T')[0],
    vetName: '',
    vetClinic: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    notes: '',
    followUpDate: '',
    cost: '',
  })
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (user) {
      loadPets()
    }
  }, [user])

  const loadPets = async () => {
    setLoading(true)
    try {
      const petsData = await api.pets.getMyPets()
      setPets(petsData)
      if (petsData.length > 0) {
        setFormData(prev => ({ ...prev, petId: petsData[0].id }))
      }
    } catch (error) {
      console.error('Failed to load pets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.petId) {
      alert('Please select a pet')
      return
    }

    setSubmitting(true)
    try {
      const recordData: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        pet: formData.petId,
        date: new Date(formData.date),
        type: formData.type,
        vetName: formData.vetName || undefined,
        vetClinic: formData.vetClinic || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        medications: formData.medications || undefined,
        notes: formData.notes || undefined,
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        attachments: selectedFiles.length > 0 ? selectedFiles.map(file => file.name) : undefined,
      }

      await api.health.addHealthRecord(recordData)
      router.push('/health?tab=records')
    } catch (error) {
      console.error('Failed to add health record:', error)
      alert('Failed to add health record. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to add health records</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/health"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Health
            </Link>
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Health Record</h1>
                <p className="text-gray-600">Record your pet's health information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Pet Selection */}
            <div>
              <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Pet *
              </label>
              <select
                id="petId"
                name="petId"
                value={formData.petId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a pet...</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} - {pet.species}
                  </option>
                ))}
              </select>
            </div>

            {/* Record Type and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Record Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="checkup">Regular Checkup</option>
                  <option value="illness">Illness</option>
                  <option value="injury">Injury</option>
                  <option value="surgery">Surgery</option>
                  <option value="medication">Medication</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Veterinarian Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vetName" className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinarian Name
                </label>
                <input
                  type="text"
                  id="vetName"
                  name="vetName"
                  value={formData.vetName}
                  onChange={handleInputChange}
                  placeholder="Dr. Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="vetClinic" className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinary Clinic
                </label>
                <input
                  type="text"
                  id="vetClinic"
                  name="vetClinic"
                  value={formData.vetClinic}
                  onChange={handleInputChange}
                  placeholder="Pet Care Clinic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-6">
              <div>
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Health condition or findings"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Treatment provided or recommended"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-2">
                  Medications
                </label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Medications prescribed or administered"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Any additional information or observations"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Follow-up and Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="followUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (£)
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <label
                  htmlFor="attachments"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload files
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Images, PDF, DOC files (Max 10MB each)
                  </span>
                </label>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                    <div className="space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          <span>{file.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/health"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding Record...</span>
                  </>
                ) : (
                  <>
                    <DocumentTextIcon className="h-5 w-5" />
                    <span>Add Health Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}