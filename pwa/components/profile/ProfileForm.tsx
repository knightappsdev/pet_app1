'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function ProfileForm() {
  const { user, updateProfile, isLoading, error, clearError } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    address: {
      street: '',
      city: '',
      county: '',
      postcode: '',
    },
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: 'public' as 'public' | 'private',
        showLocation: true,
        showPhone: false,
      }
    }
  })
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState('')

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          county: user.address?.county || '',
          postcode: user.address?.postcode || '',
        },
        preferences: {
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            push: user.preferences?.notifications?.push ?? true,
            sms: user.preferences?.notifications?.sms ?? false,
          },
          privacy: {
            profileVisibility: user.preferences?.privacy?.profileVisibility || 'public',
            showLocation: user.preferences?.privacy?.showLocation ?? true,
            showPhone: user.preferences?.privacy?.showPhone ?? false,
          }
        }
      })
    }
  }, [user])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: { ...prev.address, [child]: value }
        }))
      } else if (parent === 'notifications') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            notifications: { ...prev.preferences.notifications, [child]: checked ?? false }
          }
        }))
      } else if (parent === 'privacy') {
        setFormData(prev => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            privacy: { ...prev.preferences.privacy, [child]: type === 'checkbox' ? checked ?? false : value }
          }
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }

    // Clear messages
    if (error) clearError()
    if (successMessage) setSuccessMessage('')
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (formData.phone && !/^(\+44|0)[1-9]\d{8,9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid UK phone number'
    }

    if (formData.address.postcode && !/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i.test(formData.address.postcode)) {
      errors['address.postcode'] = 'Please enter a valid UK postcode'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await updateProfile(formData)

    if (success) {
      setIsEditing(false)
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false)
    setValidationErrors({})
    clearError()
    
    // Reset form data to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          county: user.address?.county || '',
          postcode: user.address?.postcode || '',
        },
        preferences: {
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            push: user.preferences?.notifications?.push ?? true,
            sms: user.preferences?.notifications?.sms ?? false,
          },
          privacy: {
            profileVisibility: user.preferences?.privacy?.profileVisibility || 'public',
            showLocation: user.preferences?.privacy?.showLocation ?? true,
            showPhone: user.preferences?.privacy?.showPhone ?? false,
          }
        }
      })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {user.role === 'user' ? 'Pet Owner' : 
                     user.role === 'service_provider' ? 'Service Provider' :
                     user.role === 'vet' ? 'Veterinarian' : 'User'}
                  </span>
                  {user.isVerified && (
                    <span className="text-sm bg-green-500 bg-opacity-80 px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? (
                <>
                  <XMarkIcon className="h-5 w-5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 
                    validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 
                    validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 
                    validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="07123 456789"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about yourself and your pets..."
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                  }`}
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  id="address.city"
                  name="address.city"
                  type="text"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                  }`}
                  placeholder="London"
                />
              </div>

              <div>
                <label htmlFor="address.county" className="block text-sm font-medium text-gray-700 mb-2">
                  County
                </label>
                <input
                  id="address.county"
                  name="address.county"
                  type="text"
                  value={formData.address.county}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                  }`}
                  placeholder="Greater London"
                />
              </div>

              <div>
                <label htmlFor="address.postcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  id="address.postcode"
                  name="address.postcode"
                  type="text"
                  value={formData.address.postcode}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 
                    validationErrors['address.postcode'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="SW1A 1AA"
                />
                {validationErrors['address.postcode'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['address.postcode']}</p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="privacy.profileVisibility" className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  id="privacy.profileVisibility"
                  name="privacy.profileVisibility"
                  value={formData.preferences.privacy.profileVisibility}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !isEditing ? 'bg-gray-50 text-gray-600' : 'border-gray-300'
                  }`}
                >
                  <option value="public">Public - Visible to all users</option>
                  <option value="private">Private - Visible only to connections</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="privacy.showLocation" className="text-sm font-medium text-gray-700">
                    Show Location
                  </label>
                  <p className="text-xs text-gray-500">Allow others to see your general location</p>
                </div>
                <input
                  id="privacy.showLocation"
                  name="privacy.showLocation"
                  type="checkbox"
                  checked={formData.preferences.privacy.showLocation}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="privacy.showPhone" className="text-sm font-medium text-gray-700">
                    Show Phone Number
                  </label>
                  <p className="text-xs text-gray-500">Display your phone number on your profile</p>
                </div>
                <input
                  id="privacy.showPhone"
                  name="privacy.showPhone"
                  type="checkbox"
                  checked={formData.preferences.privacy.showPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="notifications.email" className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">Receive updates and reminders via email</p>
                </div>
                <input
                  id="notifications.email"
                  name="notifications.email"
                  type="checkbox"
                  checked={formData.preferences.notifications.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="notifications.push" className="text-sm font-medium text-gray-700">
                    Push Notifications
                  </label>
                  <p className="text-xs text-gray-500">Get instant notifications on your device</p>
                </div>
                <input
                  id="notifications.push"
                  name="notifications.push"
                  type="checkbox"
                  checked={formData.preferences.notifications.push}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="notifications.sms" className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <p className="text-xs text-gray-500">Receive urgent notifications via text message</p>
                </div>
                <input
                  id="notifications.sms"
                  name="notifications.sms"
                  type="checkbox"
                  checked={formData.preferences.notifications.sms}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}