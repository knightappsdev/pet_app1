'use client';

import React, { useState } from 'react';
import { PetProfile as PetProfileType, HealthRecord, VaccinationRecord } from '@/lib/api';

interface PetProfileProps {
  pet: PetProfileType;
  onEdit?: () => void;
  onClose?: () => void;
  isOwner?: boolean;
}

export default function PetProfile({ pet, onEdit, onClose, isOwner = false }: PetProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'vaccinations' | 'records'>('overview');

  const calculateAge = (birthDate?: Date) => {
    if (!birthDate) return 'Unknown age';
    
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days old`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(diffDays / 365);
      const months = Math.floor((diffDays % 365) / 30);
      if (months === 0) {
        return `${years} year${years !== 1 ? 's' : ''} old`;
      }
      return `${years}y ${months}m old`;
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👁️' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'vaccinations', label: 'Vaccinations', icon: '💉' },
    { id: 'records', label: 'Records', icon: '📋' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {/* Pet Photo */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white bg-opacity-20">
                {pet.photos && pet.photos.length > 0 ? (
                  <img 
                    src={pet.photos[0]} 
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                    {getInitial(pet.name)}
                  </div>
                )}
              </div>
              
              {/* Pet Info */}
              <div>
                <h1 className="text-3xl font-bold">{pet.name}</h1>
                <p className="text-lg opacity-90">
                  {pet.breed || 'Mixed breed'} {pet.species}
                </p>
                <p className="text-sm opacity-75">
                  {calculateAge(pet.dateOfBirth)} • {pet.gender}
                  {pet.weight && ` • ${pet.weight}kg`}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {isOwner && onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  ✏️ Edit
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Species:</span>
                      <span className="font-medium">{pet.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breed:</span>
                      <span className="font-medium">{pet.breed || 'Mixed breed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{pet.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{calculateAge(pet.dateOfBirth)}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">{pet.weight}kg</span>
                      </div>
                    )}
                    {pet.size && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{pet.size}</span>
                      </div>
                    )}
                    {pet.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium">{pet.color}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Vaccinated:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pet.isVaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pet.isVaccinated ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Neutered/Spayed:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pet.isNeutered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pet.isNeutered ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    
                    {pet.microchipId && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Microchip ID:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {pet.microchipId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {pet.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About {pet.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{pet.description}</p>
                </div>
              )}

              {/* Emergency Contact */}
              {pet.emergencyContact && pet.emergencyContact.name && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{pet.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">{pet.emergencyContact.phone}</p>
                      <p className="text-sm text-gray-600">{pet.emergencyContact.relationship}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Owner Info */}
              {pet.owner && !isOwner && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{pet.owner.firstName} {pet.owner.lastName}</p>
                    {pet.owner.location && (
                      <p className="text-sm text-gray-600">📍 {pet.owner.location.city}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Medical Conditions */}
              {pet.medicalConditions && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Conditions</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{pet.medicalConditions}</p>
                  </div>
                </div>
              )}

              {/* Allergies */}
              {pet.allergies && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Allergies</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">{pet.allergies}</p>
                  </div>
                </div>
              )}

              {/* Special Needs */}
              {pet.specialNeeds && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Needs</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">{pet.specialNeeds}</p>
                  </div>
                </div>
              )}

              {/* No Health Info */}
              {!pet.medicalConditions && !pet.allergies && !pet.specialNeeds && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏥</div>
                  <p>No health information recorded</p>
                  {isOwner && (
                    <p className="text-sm mt-1">Add health records to keep track of medical history</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'vaccinations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Vaccination Records</h3>
                {isOwner && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Add Vaccination
                  </button>
                )}
              </div>

              {/* Placeholder for vaccination records */}
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">💉</div>
                <p>No vaccination records found</p>
                {isOwner && (
                  <p className="text-sm mt-1">Keep track of vaccinations and due dates</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Health Records</h3>
                {isOwner && (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Add Record
                  </button>
                )}
              </div>

              {/* Placeholder for health records */}
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📋</div>
                <p>No health records found</p>
                {isOwner && (
                  <p className="text-sm mt-1">Add vet visits, treatments, and medical notes</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}