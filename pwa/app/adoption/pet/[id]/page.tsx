'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api, AdoptionListing } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { 
  HeartIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  ShareIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function PetDetailPage() {
  const params = useParams()
  const petId = params.id as string
  const { user } = useAuth()
  
  const [pet, setPet] = useState<AdoptionListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    if (petId) {
      loadPetData()
    }
  }, [petId])

  const loadPetData = async () => {
    try {
      setLoading(true)
      
      const [petData, favorites] = await Promise.all([
        api.adoption.getListing(petId),
        user ? api.adoption.getFavorites() : []
      ])
      
      if (!petData) {
        throw new Error('Pet not found')
      }
      
      setPet(petData)
      
      if (user && favorites) {
        const isFav = favorites.some(fav => fav.petId === petId)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.error('Failed to load pet data:', error)
      alert('Pet not found')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites')
      return
    }

    try {
      if (isFavorite) {
        const favorites = await api.adoption.getFavorites()
        const favorite = favorites.find(fav => fav.petId === petId)
        if (favorite) {
          await api.adoption.removeFromFavorites(favorite._id)
          setIsFavorite(false)
        }
      } else {
        await api.adoption.addToFavorites(petId)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Failed to update favorites:', error)
      alert('Failed to update favorites')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meet ${pet?.petName} - Available for Adoption`,
          text: `${pet?.petName} is a ${pet?.age.years} year old ${pet?.breed} looking for a loving home!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleReport = async (reason: string, details: string) => {
    try {
      await api.adoption.reportListing(petId, reason, details)
      setShowReportModal(false)
      alert('Report submitted successfully. Thank you for helping keep our platform safe.')
    } catch (error) {
      console.error('Failed to submit report:', error)
      alert('Failed to submit report. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet details...</p>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
          <p className="text-gray-600 mb-6">The pet you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/adoption"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Available Pets
          </Link>
        </div>
      </div>
    )
  }

  const getAgeString = (age: AdoptionListing['age']) => {
    if (age.years === 0) {
      return `${age.months} months old`
    } else if (age.months === 0) {
      return `${age.years} ${age.years === 1 ? 'year' : 'years'} old`
    } else {
      return `${age.years}y ${age.months}m old`
    }
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/adoption"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg mr-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{pet.petName}</h1>
              {pet.urgency && pet.urgency !== 'low' && (
                <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold border ${getUrgencyColor(pet.urgency)}`}>
                  {pet.urgency === 'critical' ? 'URGENT' : pet.urgency.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FlagIcon className="h-5 w-5" />
              </button>
              
              {user && (
                <button
                  onClick={toggleFavorite}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Gallery */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative">
                <img
                  src={pet.images[currentImageIndex] || 'https://via.placeholder.com/600x400?text=Pet+Photo'}
                  alt={`${pet.petName} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
                
                {pet.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? pet.images.length - 1 : prev - 1)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === pet.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {pet.images.length > 1 && (
                <div className="flex space-x-2 mt-4 overflow-x-auto">
                  {pet.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${pet.petName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pet Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {pet.petName}</h2>
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">Species:</span>
                  <p className="font-semibold capitalize">{pet.species}</p>
                </div>
                <div>
                  <span className="text-gray-600">Breed:</span>
                  <p className="font-semibold">{pet.breed}</p>
                </div>
                <div>
                  <span className="text-gray-600">Age:</span>
                  <p className="font-semibold">{getAgeString(pet.age)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-semibold capitalize">{pet.gender}</p>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <p className="font-semibold capitalize">{pet.size.replace('_', ' ')}</p>
                </div>
                {pet.weight && (
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <p className="font-semibold">{pet.weight} kg</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{pet.description}</p>
              </div>

              {/* Story */}
              {pet.story && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{pet.petName}'s Story</h3>
                  <p className="text-gray-700">{pet.story}</p>
                </div>
              )}

              {/* Personality Traits */}
              {pet.personalityTraits.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Personality</h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.personalityTraits.map((trait) => (
                      <span
                        key={trait}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Good With */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Good With</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center ${pet.goodWith.children ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.goodWith.children ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <span className="mr-2">✗</span>}
                    Children
                  </div>
                  <div className={`flex items-center ${pet.goodWith.cats ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.goodWith.cats ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <span className="mr-2">✗</span>}
                    Cats
                  </div>
                  <div className={`flex items-center ${pet.goodWith.dogs ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.goodWith.dogs ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <span className="mr-2">✗</span>}
                    Dogs
                  </div>
                  <div className={`flex items-center ${pet.goodWith.otherPets ? 'text-green-600' : 'text-red-600'}`}>
                    {pet.goodWith.otherPets ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <span className="mr-2">✗</span>}
                    Other Pets
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Medical Information</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className={`flex items-center ${pet.medicalHistory.vaccinated ? 'text-green-600' : 'text-orange-600'}`}>
                    {pet.medicalHistory.vaccinated ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
                    {pet.medicalHistory.vaccinated ? 'Vaccinated' : 'Needs Vaccination'}
                  </div>
                  <div className={`flex items-center ${pet.medicalHistory.neutered ? 'text-green-600' : 'text-orange-600'}`}>
                    {pet.medicalHistory.neutered ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
                    {pet.medicalHistory.neutered ? 'Spayed/Neutered' : 'Not Spayed/Neutered'}
                  </div>
                  <div className={`flex items-center ${pet.medicalHistory.microchipped ? 'text-green-600' : 'text-orange-600'}`}>
                    {pet.medicalHistory.microchipped ? <CheckBadgeIcon className="h-5 w-5 mr-2" /> : <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
                    {pet.medicalHistory.microchipped ? 'Microchipped' : 'Needs Microchip'}
                  </div>
                </div>
                
                {pet.medicalHistory.healthIssues && pet.medicalHistory.healthIssues.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Health Issues:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {pet.medicalHistory.healthIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pet.medicalHistory.medications && pet.medicalHistory.medications.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700">Current Medications:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {pet.medicalHistory.medications.map((medication, index) => (
                        <li key={index}>{medication}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Special Needs */}
              {pet.specialNeeds && pet.specialNeeds.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Special Needs</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {pet.specialNeeds.map((need, index) => (
                      <li key={index}>{need}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {pet.requirements && pet.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adoption Requirements</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {pet.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Adoption Info */}
          <div className="lg:col-span-1">
            {/* Adoption Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {pet.adoptionFee === 0 ? 'Free' : `£${pet.adoptionFee}`}
                </div>
                <div className="text-gray-600">Adoption Fee</div>
              </div>

              {user ? (
                <Link
                  href={`/adoption/apply/${pet._id}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block mb-4"
                >
                  Apply to Adopt
                </Link>
              ) : (
                <div className="mb-4">
                  <Link
                    href="/auth/login"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                  >
                    Login to Apply
                  </Link>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Create an account to start the adoption process
                  </p>
                </div>
              )}

              {/* Shelter Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Shelter Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{pet.shelter.name}</span>
                      {pet.shelter.verified && (
                        <CheckBadgeIcon className="h-5 w-5 text-blue-500 ml-2" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Rating: {pet.shelter.rating}/5</div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm">{pet.shelter.address}, {pet.shelter.city}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <a href={`tel:${pet.shelter.phone}`} className="text-sm hover:text-blue-600">
                      {pet.shelter.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <a href={`mailto:${pet.shelter.email}`} className="text-sm hover:text-blue-600">
                      {pet.shelter.email}
                    </a>
                  </div>

                  {pet.shelter.website && (
                    <div>
                      <a
                        href={pet.shelter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Visit Shelter Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Pet Stats */}
              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Listing Stats</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span>{pet.viewCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Favorites:</span>
                    <span>{pet.favoriteCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applications:</span>
                    <span>{pet.applicationCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Listed:</span>
                    <span>{new Date(pet.datePosted).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReport}
        />
      )}

      <Navigation />
    </div>
  )
}

interface ReportModalProps {
  onClose: () => void
  onSubmit: (reason: string, details: string) => void
}

function ReportModal({ onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim() || !details.trim()) {
      alert('Please provide both a reason and details')
      return
    }
    onSubmit(reason, details)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Report Listing</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a reason</option>
              <option value="inappropriate_content">Inappropriate Content</option>
              <option value="fraudulent_listing">Fraudulent Listing</option>
              <option value="already_adopted">Pet Already Adopted</option>
              <option value="incorrect_information">Incorrect Information</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide more details about the issue..."
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}