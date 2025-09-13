'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api, AdoptionListing, AdoptionApplicationRequest } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AdoptionApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const petId = params.id as string
  const { user } = useAuth()
  
  const [pet, setPet] = useState<AdoptionListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  // Form state
  const [formData, setFormData] = useState<AdoptionApplicationRequest>({
    petId,
    personalInfo: {
      fullName: '',
      dateOfBirth: '',
      occupation: '',
      phoneNumber: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        county: '',
        postcode: '',
        country: 'United Kingdom'
      }
    },
    housingInfo: {
      type: 'house',
      ownership: 'own',
      hasGarden: false,
      otherPets: {
        hasPets: false,
        pets: []
      }
    },
    experience: {
      previousPets: false,
      petCareKnowledge: '',
      dailyRoutine: '',
      exerciseCommitment: '',
      trainingApproach: ''
    },
    references: {
      personal: [{
        name: '',
        relationship: '',
        phone: '',
        email: '',
        yearsKnown: 1
      }]
    },
    additionalInfo: {
      motivation: '',
      expectations: '',
      contingencyPlan: '',
      timeCommitment: '',
      financialPreparedness: false,
      emergencyVetFund: false,
      agreesToHomeVisit: false,
      agreesToFollowUp: false
    }
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    if (petId) {
      loadPetData()
    }
  }, [petId, user])

  useEffect(() => {
    // Pre-fill user information if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          phoneNumber: user.phone || '',
          address: {
            ...prev.personalInfo.address,
            ...(user.address || {})
          }
        }
      }))
    }
  }, [user])

  const loadPetData = async () => {
    try {
      setLoading(true)
      const petData = await api.adoption.getListing(petId)
      
      if (!petData) {
        throw new Error('Pet not found')
      }
      
      setPet(petData)
    } catch (error) {
      console.error('Failed to load pet data:', error)
      alert('Pet not found')
      router.push('/adoption')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (section: keyof AdoptionApplicationRequest, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), ...data }
    }))
  }

  const addPersonalReference = () => {
    setFormData(prev => ({
      ...prev,
      references: {
        ...prev.references,
        personal: [...prev.references.personal, {
          name: '',
          relationship: '',
          phone: '',
          email: '',
          yearsKnown: 1
        }]
      }
    }))
  }

  const removePersonalReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: {
        ...prev.references,
        personal: prev.references.personal.filter((_, i) => i !== index)
      }
    }))
  }

  const addPet = () => {
    setFormData(prev => ({
      ...prev,
      housingInfo: {
        ...prev.housingInfo,
        otherPets: {
          ...prev.housingInfo.otherPets,
          pets: [...(prev.housingInfo.otherPets.pets || []), {
            type: '',
            breed: '',
            age: 0,
            neutered: false
          }]
        }
      }
    }))
  }

  const removePet = (index: number) => {
    setFormData(prev => ({
      ...prev,
      housingInfo: {
        ...prev.housingInfo,
        otherPets: {
          ...prev.housingInfo.otherPets,
          pets: (prev.housingInfo.otherPets.pets || []).filter((_, i) => i !== index)
        }
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields
    const requiredFields = [
      formData.personalInfo.fullName,
      formData.personalInfo.dateOfBirth,
      formData.personalInfo.phoneNumber,
      formData.personalInfo.email,
      formData.personalInfo.address.line1,
      formData.personalInfo.address.city,
      formData.personalInfo.address.postcode,
      formData.experience.petCareKnowledge,
      formData.experience.dailyRoutine,
      formData.experience.exerciseCommitment,
      formData.experience.trainingApproach,
      formData.additionalInfo.motivation,
      formData.additionalInfo.expectations,
      formData.additionalInfo.contingencyPlan,
      formData.additionalInfo.timeCommitment
    ]

    if (requiredFields.some(field => !field || field.toString().trim() === '')) {
      alert('Please fill in all required fields')
      return
    }

    if (!formData.additionalInfo.agreesToHomeVisit || !formData.additionalInfo.agreesToFollowUp) {
      alert('You must agree to home visits and follow-ups to proceed with the application')
      return
    }

    try {
      setSubmitting(true)
      await api.adoption.submitApplication(formData)
      alert('Application submitted successfully! The shelter will review your application and contact you soon.')
      router.push('/adoption/applications')
    } catch (error) {
      console.error('Failed to submit application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application form...</p>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href={`/adoption/pet/${pet._id}`}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg mr-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Adoption Application</h1>
                <p className="text-gray-600 text-sm">For {pet.petName}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Personal Info</span>
              <span>Housing</span>
              <span>Experience</span>
              <span>References</span>
              <span>Final Details</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <PersonalInfoStep
              data={formData.personalInfo}
              onChange={(data) => updateFormData('personalInfo', data)}
            />
          )}

          {/* Step 2: Housing Information */}
          {currentStep === 2 && (
            <HousingInfoStep
              data={formData.housingInfo}
              onChange={(data) => updateFormData('housingInfo', data)}
              onAddPet={addPet}
              onRemovePet={removePet}
            />
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <ExperienceStep
              data={formData.experience}
              onChange={(data) => updateFormData('experience', data)}
            />
          )}

          {/* Step 4: References */}
          {currentStep === 4 && (
            <ReferencesStep
              data={formData.references}
              onChange={(data) => updateFormData('references', data)}
              onAddReference={addPersonalReference}
              onRemoveReference={removePersonalReference}
            />
          )}

          {/* Step 5: Additional Information */}
          {currentStep === 5 && (
            <FinalStep
              data={formData.additionalInfo}
              onChange={(data) => updateFormData('additionalInfo', data)}
              pet={pet}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep === totalSteps ? (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>

      <Navigation />
    </div>
  )
}

// Step Component Interfaces
interface StepProps<T> {
  data: T
  onChange: (data: Partial<T>) => void
}

interface HousingStepProps extends StepProps<AdoptionApplicationRequest['housingInfo']> {
  onAddPet: () => void
  onRemovePet: (index: number) => void
}

interface ReferencesStepProps extends StepProps<AdoptionApplicationRequest['references']> {
  onAddReference: () => void
  onRemoveReference: (index: number) => void
}

interface FinalStepProps extends StepProps<AdoptionApplicationRequest['additionalInfo']> {
  pet: AdoptionListing
}

function PersonalInfoStep({ data, onChange }: StepProps<AdoptionApplicationRequest['personalInfo']>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
          <input
            type="text"
            value={data.occupation}
            onChange={(e) => onChange({ occupation: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={data.phoneNumber}
            onChange={(e) => onChange({ phoneNumber: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Address</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
          <input
            type="text"
            value={data.address.line1}
            onChange={(e) => onChange({ address: { ...data.address, line1: e.target.value } })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={data.address.city}
              onChange={(e) => onChange({ address: { ...data.address, city: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
            <input
              type="text"
              value={data.address.county}
              onChange={(e) => onChange({ address: { ...data.address, county: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
            <input
              type="text"
              value={data.address.postcode}
              onChange={(e) => onChange({ address: { ...data.address, postcode: e.target.value } })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function HousingInfoStep({ data, onChange }: HousingStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Housing Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Home Type *</label>
          <select
            value={data.type}
            onChange={(e) => onChange({ type: e.target.value as AdoptionApplicationRequest['housingInfo']['type'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="flat">Flat</option>
            <option value="bungalow">Bungalow</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ownership *</label>
          <select
            value={data.ownership}
            onChange={(e) => onChange({ ownership: e.target.value as AdoptionApplicationRequest['housingInfo']['ownership'] })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="own">Own</option>
            <option value="rent">Rent</option>
            <option value="live_with_family">Live with Family</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.hasGarden}
            onChange={(e) => onChange({ hasGarden: e.target.checked })}
            className="mr-3"
          />
          <span className="text-sm font-medium text-gray-700">Do you have a garden?</span>
        </label>
      </div>
    </div>
  )
}

function ExperienceStep({ data, onChange }: StepProps<AdoptionApplicationRequest['experience']>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Pet Experience</h2>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={data.previousPets}
              onChange={(e) => onChange({ previousPets: e.target.checked })}
              className="mr-3"
            />
            <span className="text-sm font-medium text-gray-700">I have owned pets before</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pet Care Knowledge *</label>
          <textarea
            value={data.petCareKnowledge}
            onChange={(e) => onChange({ petCareKnowledge: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your knowledge about pet care..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Routine *</label>
          <textarea
            value={data.dailyRoutine}
            onChange={(e) => onChange({ dailyRoutine: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your daily routine and how a pet would fit in..."
            required
          />
        </div>
      </div>
    </div>
  )
}

function ReferencesStep({ data, onChange, onAddReference, onRemoveReference }: ReferencesStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">References</h2>
      
      <div className="space-y-6">
        {data.personal.map((ref: any, index: number) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Personal Reference {index + 1}</h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => onRemoveReference(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => {
                    const updated = [...data.personal]
                    updated[index].name = e.target.value
                    onChange({ personal: updated })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                <input
                  type="text"
                  value={ref.relationship}
                  onChange={(e) => {
                    const updated = [...data.personal]
                    updated[index].relationship = e.target.value
                    onChange({ personal: updated })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => {
                    const updated = [...data.personal]
                    updated[index].phone = e.target.value
                    onChange({ personal: updated })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years Known *</label>
                <input
                  type="number"
                  min="1"
                  value={ref.yearsKnown}
                  onChange={(e) => {
                    const updated = [...data.personal]
                    updated[index].yearsKnown = parseInt(e.target.value)
                    onChange({ personal: updated })
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={onAddReference}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add Another Reference
        </button>
      </div>
    </div>
  )
}

function FinalStep({ data, onChange, pet }: FinalStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Final Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to adopt {pet.petName}? *</label>
          <textarea
            value={data.motivation}
            onChange={(e) => onChange({ motivation: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about your motivation for adopting this pet..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What are your expectations? *</label>
          <textarea
            value={data.expectations}
            onChange={(e) => onChange({ expectations: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="What do you expect from this adoption?"
            required
          />
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.financialPreparedness}
              onChange={(e) => onChange({ financialPreparedness: e.target.checked })}
              className="mr-3"
            />
            <span className="text-sm">I am financially prepared for pet ownership costs</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.emergencyVetFund}
              onChange={(e) => onChange({ emergencyVetFund: e.target.checked })}
              className="mr-3"
            />
            <span className="text-sm">I have funds available for emergency veterinary care</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.agreesToHomeVisit}
              onChange={(e) => onChange({ agreesToHomeVisit: e.target.checked })}
              className="mr-3"
              required
            />
            <span className="text-sm">I agree to a home visit before adoption *</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={data.agreesToFollowUp}
              onChange={(e) => onChange({ agreesToFollowUp: e.target.checked })}
              className="mr-3"
              required
            />
            <span className="text-sm">I agree to follow-up visits after adoption *</span>
          </label>
        </div>
      </div>
    </div>
  )
}