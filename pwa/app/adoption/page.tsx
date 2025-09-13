'use client'

import React, { useState, useEffect } from 'react'
import { api, AdoptionListing, type AdoptionFilters } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { HeartIcon, MapPinIcon, ClockIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function AdoptionPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<AdoptionListing[]>([])
  const [featuredListings, setFeaturedListings] = useState<AdoptionListing[]>([])
  const [urgentListings, setUrgentListings] = useState<AdoptionListing[]>([])
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<AdoptionFilters>({})
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    urgentPets: 0,
    successfulAdoptions: 0,
    shelterCount: 0
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadListings()
  }, [filters, currentPage])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Load featured listings, urgent listings, and stats
      const [featured, urgent, adoptionStats, favorites] = await Promise.all([
        api.adoption.getFeaturedListings(6),
        api.adoption.getUrgentListings(4),
        api.adoption.getStats(),
        user ? api.adoption.getFavorites() : []
      ])
      
      setFeaturedListings(featured)
      setUrgentListings(urgent)
      setStats(adoptionStats)
      
      if (user && favorites) {
        const favoriteSet = new Set(favorites.map(fav => fav.petId))
        setFavoriteIds(favoriteSet)
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadListings = async () => {
    try {
      const result = await api.adoption.getListings({
        ...filters,
        page: currentPage,
        limit: 12
      })
      
      setListings(result.listings)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Failed to load listings:', error)
    }
  }

  const toggleFavorite = async (petId: string) => {
    if (!user) {
      alert('Please login to save favorites')
      return
    }

    try {
      if (favoriteIds.has(petId)) {
        // Find the favorite to remove
        const favorites = await api.adoption.getFavorites()
        const favorite = favorites.find(fav => fav.petId === petId)
        if (favorite) {
          await api.adoption.removeFromFavorites(favorite._id)
          setFavoriteIds(prev => {
            const newSet = new Set(prev)
            newSet.delete(petId)
            return newSet
          })
        }
      } else {
        await api.adoption.addToFavorites(petId)
        setFavoriteIds(prev => new Set([...prev, petId]))
      }
    } catch (error) {
      console.error('Failed to update favorites:', error)
      alert('Failed to update favorites')
    }
  }

  const applyFilters = (newFilters: AdoptionFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pets looking for homes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Pet Adoption</h1>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pets..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
              
              {/* Favorites Link */}
              {user && (
                <Link
                  href="/adoption/favorites"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{stats.availablePets}</div>
              <div className="text-blue-100">Available Pets</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.urgentPets}</div>
              <div className="text-blue-100">Urgent Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.successfulAdoptions}</div>
              <div className="text-blue-100">Happy Adoptions</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.shelterCount}</div>
              <div className="text-blue-100">Partner Shelters</div>
            </div>
            <div>
              <Link
                href="/adoption/applications"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 transition-colors block"
              >
                <div className="font-semibold">My Applications</div>
                <div className="text-blue-100 text-sm">Track Status</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <AdoptionFilters 
              filters={filters} 
              onApply={applyFilters} 
              onClear={clearFilters} 
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Urgent Pets */}
        {urgentListings.length > 0 && !Object.keys(filters).length && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Urgent - Need Homes Now!</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {urgentListings.map((listing) => (
                <PetCard
                  key={listing._id}
                  listing={listing}
                  isFavorite={favoriteIds.has(listing._id)}
                  onToggleFavorite={() => toggleFavorite(listing._id)}
                  showFavorite={!!user}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured Pets */}
        {featuredListings.length > 0 && !Object.keys(filters).length && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Pets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((listing) => (
                <PetCard
                  key={listing._id}
                  listing={listing}
                  isFavorite={favoriteIds.has(listing._id)}
                  onToggleFavorite={() => toggleFavorite(listing._id)}
                  showFavorite={!!user}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Pets */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {Object.keys(filters).length ? 'Search Results' : 'All Available Pets'}
            </h2>
            <p className="text-gray-600">{listings.length} pets found</p>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No pets found matching your criteria.</p>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters to see all pets
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <PetCard
                    key={listing._id}
                    listing={listing}
                    isFavorite={favoriteIds.has(listing._id)}
                    onToggleFavorite={() => toggleFavorite(listing._id)}
                    showFavorite={!!user}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  )
}

interface PetCardProps {
  listing: AdoptionListing
  isFavorite: boolean
  onToggleFavorite: () => void
  showFavorite: boolean
}

function PetCard({ listing, isFavorite, onToggleFavorite, showFavorite }: PetCardProps) {
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/adoption/pet/${listing._id}`}>
        <div className="relative">
          <img
            src={listing.images[0] || 'https://via.placeholder.com/300x200?text=Pet+Photo'}
            alt={listing.petName}
            className="w-full h-48 object-cover"
          />
          
          {listing.urgency && listing.urgency !== 'low' && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold border ${getUrgencyColor(listing.urgency)}`}>
              {listing.urgency === 'critical' ? 'URGENT' : listing.urgency.toUpperCase()}
            </div>
          )}
          
          {listing.featured && (
            <div className="absolute top-2 right-2 bg-gold-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{listing.petName}</h3>
          {showFavorite && (
            <button
              onClick={onToggleFavorite}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">
          {listing.breed} • {getAgeString(listing.age)} • {listing.gender}
        </p>
        
        <p className="text-gray-700 text-sm line-clamp-2 mb-3">{listing.description}</p>
        
        {listing.personalityTraits.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {listing.personalityTraits.slice(0, 3).map((trait) => (
              <span
                key={trait}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {trait}
              </span>
            ))}
            {listing.personalityTraits.length > 3 && (
              <span className="text-xs text-gray-500">+{listing.personalityTraits.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{listing.location.city}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{new Date(listing.datePosted).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {listing.adoptionFee === 0 ? 'Free' : `£${listing.adoptionFee}`}
          </span>
          
          <Link
            href={`/adoption/pet/${listing._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">{listing.shelter.name}</p>
      </div>
    </div>
  )
}

interface AdoptionFiltersProps {
  filters: AdoptionFilters
  onApply: (filters: AdoptionFilters) => void
  onClear: () => void
}

function AdoptionFilters({ filters, onApply, onClear }: AdoptionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AdoptionFilters>(filters)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Species Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
        <select
          value={localFilters.species || ''}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, species: e.target.value || undefined }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Species</option>
          <option value="dog">Dogs</option>
          <option value="cat">Cats</option>
          <option value="rabbit">Rabbits</option>
          <option value="bird">Birds</option>
          <option value="hamster">Hamsters</option>
          <option value="fish">Fish</option>
        </select>
      </div>

      {/* Size Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
        <select
          value={localFilters.size || ''}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, size: e.target.value || undefined }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra_large">Extra Large</option>
        </select>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
        <div className="flex space-x-1">
          <input
            type="number"
            placeholder="Min"
            value={localFilters.ageMin || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, ageMin: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={localFilters.ageMax || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, ageMax: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Good With */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Good With</label>
        <div className="space-y-1">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={localFilters.goodWithChildren || false}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, goodWithChildren: e.target.checked }))}
              className="mr-2"
            />
            Children
          </label>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={localFilters.goodWithCats || false}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, goodWithCats: e.target.checked }))}
              className="mr-2"
            />
            Cats
          </label>
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={localFilters.goodWithDogs || false}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, goodWithDogs: e.target.checked }))}
              className="mr-2"
            />
            Dogs
          </label>
        </div>
      </div>

      {/* Max Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Fee (£)</label>
        <input
          type="number"
          placeholder="Any amount"
          value={localFilters.adoptionFeeMax || ''}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, adoptionFeeMax: e.target.value ? parseInt(e.target.value) : undefined }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-end space-y-2">
        <button
          onClick={() => onApply(localFilters)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={() => {
            setLocalFilters({})
            onClear()
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}