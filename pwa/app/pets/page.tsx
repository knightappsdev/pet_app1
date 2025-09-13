'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, PetProfile } from '@/lib/api';
import PetCard from '@/components/pets/PetCard';
import AddPetForm from '@/components/pets/AddPetForm';
import PetProfileComponent from '@/components/pets/PetProfile';

export default function PetsPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('');

  useEffect(() => {
    if (user) {
      loadPets();
    }
  }, [user]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const userPets = await api.pets.getMyPets();
      setPets(userPets);
    } catch (err) {
      setError('Failed to load pets');
      console.error('Error loading pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePetAdded = (newPet: PetProfile) => {
    setPets(prev => [...prev, newPet]);
    setShowAddForm(false);
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecies = filterSpecies === '' || pet.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const speciesOptions = [...new Set(pets.map(pet => pet.species))];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to manage your pets</h2>
          <p className="text-gray-600 mb-6">Keep track of your furry friends' health and happiness</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Pets</h1>
              <p className="text-gray-600 mt-1">
                Manage your pet profiles and health records
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Pet</span>
            </button>
          </div>

          {/* Search and Filters */}
          {pets.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search pets by name or breed..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              {speciesOptions.length > 1 && (
                <div className="sm:w-48">
                  <select
                    value={filterSpecies}
                    onChange={(e) => setFilterSpecies(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">All Species</option>
                    {speciesOptions.map(species => (
                      <option key={species} value={species}>{species}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Pets Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => setSelectedPet(pet)}
                className="hover:scale-105 transition-transform duration-200"
              />
            ))}
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Add your first pet to start managing their health records, scheduling services, and connecting with other pet owners.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Your First Pet</span>
            </button>
          </div>
        ) : (
          /* No Search Results */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterSpecies('');
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Quick Stats */}
        {pets.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{pets.length}</div>
                <div className="text-sm text-gray-600">Total Pets</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {pets.filter(pet => pet.isVaccinated).length}
                </div>
                <div className="text-sm text-gray-600">Vaccinated</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {pets.filter(pet => pet.isNeutered).length}
                </div>
                <div className="text-sm text-gray-600">Neutered/Spayed</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {pets.filter(pet => pet.microchipId).length}
                </div>
                <div className="text-sm text-gray-600">Microchipped</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      {showAddForm && (
        <AddPetForm
          onPetAdded={handlePetAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Pet Profile Modal */}
      {selectedPet && (
        <PetProfileComponent
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          isOwner={true}
          onEdit={() => {
            // TODO: Implement edit functionality
            console.log('Edit pet:', selectedPet.id);
          }}
        />
      )}
    </div>
  );
}