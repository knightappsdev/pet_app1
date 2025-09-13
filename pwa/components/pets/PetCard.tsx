'use client';

import React from 'react';
import { PetProfile } from '@/lib/api';

interface PetCardProps {
  pet: PetProfile;
  onClick?: () => void;
  showOwner?: boolean;
  className?: string;
}

export default function PetCard({ pet, onClick, showOwner = false, className = '' }: PetCardProps) {
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

  const getStatusBadges = () => {
    const badges = [];
    
    if (pet.isVaccinated) {
      badges.push(
        <span key="vaccinated" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Vaccinated
        </span>
      );
    }
    
    if (pet.isNeutered) {
      badges.push(
        <span key="neutered" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          ✓ Neutered
        </span>
      );
    }
    
    if (pet.microchipId) {
      badges.push(
        <span key="microchip" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          ✓ Microchipped
        </span>
      );
    }

    return badges;
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Pet Photo */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
        {pet.photos && pet.photos.length > 0 ? (
          <img 
            src={pet.photos[0]} 
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-purple-600">
              {getInitial(pet.name)}
            </div>
          </div>
        )}
        
        {/* Species Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
            {pet.species}
          </span>
        </div>
        
        {/* Gender Badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            pet.gender === 'Male' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-pink-100 text-pink-800'
          }`}>
            {pet.gender === 'Male' ? '♂' : '♀'} {pet.gender}
          </span>
        </div>
      </div>

      {/* Pet Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {pet.name}
            </h3>
            <p className="text-sm text-gray-600">
              {pet.breed || 'Mixed breed'} • {calculateAge(pet.dateOfBirth)}
            </p>
          </div>
          
          {pet.weight && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{pet.weight}kg</p>
              <p className="text-xs text-gray-500">Weight</p>
            </div>
          )}
        </div>

        {/* Description */}
        {pet.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {pet.description}
          </p>
        )}

        {/* Status Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {getStatusBadges()}
        </div>

        {/* Owner Information */}
        {showOwner && pet.owner && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Owner: <span className="font-medium">{pet.owner.firstName} {pet.owner.lastName}</span>
            </p>
            {pet.owner.location && (
              <p className="text-xs text-gray-500">
                📍 {pet.owner.location.city}
              </p>
            )}
          </div>
        )}

        {/* Color/Markings */}
        {pet.color && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Coloring: <span className="text-gray-700">{pet.color}</span>
            </p>
          </div>
        )}

        {/* Special Needs Indicator */}
        {pet.specialNeeds && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              ⚠️ Special Needs
            </span>
          </div>
        )}

        {/* Medical Conditions */}
        {pet.medicalConditions && (
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              🏥 Medical Conditions
            </span>
          </div>
        )}
      </div>
    </div>
  );
}