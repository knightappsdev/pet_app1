'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Service, ServiceProvider, ServiceFilters, Booking, ServiceType } from '@/lib/api';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceFiltersComponent from '@/components/services/ServiceFilters';
import BookingForm from '@/components/services/BookingForm';

export default function ServicesPage() {
  const { user } = useAuth();
  
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'services' | 'providers'>('services');
  const [filters, setFilters] = useState<ServiceFilters>({});
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [filters, viewMode]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      if (viewMode === 'services') {
        // For now, we'll create mock services since the backend returns basic data
        const mockServices = generateMockServices();
        setServices(mockServices);
      } else {
        // For now, we'll create mock providers
        const mockProviders = generateMockProviders();
        setProviders(mockProviders);
      }
    } catch (err) {
      setError('Failed to load services');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data until backend is fully implemented
  const generateMockServices = (): Service[] => {
    const mockData = [
      {
        id: 'service_1',
        type: 'dog_walking' as const,
        name: 'Professional Dog Walking',
        description: 'Experienced dog walker providing safe, fun walks for your furry friends in local parks and neighborhoods.',
        provider: {
          id: 'provider_1',
          businessName: 'Happy Paws Walking',
          user: {
            id: 'user_1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah@happypaws.uk',
            role: 'service_provider' as const,
            isVerified: true,
            location: { type: 'Point' as const, coordinates: [-0.1276, 51.5074] as [number, number], city: 'London' },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          serviceTypes: ['dog_walking'] as ServiceType[],
          description: 'Professional dog walking service with 5+ years experience',
          experience: '5+ years',
          qualifications: ['Pet First Aid Certified', 'Insured & Bonded'],
          averageRating: 4.8,
          totalReviews: 127,
          isVerified: true,
          isActive: true,
          serviceArea: { radius: 10, postcodes: ['SW1', 'SW7', 'SW3'] },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        price: { type: 'hourly' as const, amount: 20, currency: 'GBP' as const },
        duration: 1,
        availability: { 
          monday: true, 
          tuesday: true, 
          wednesday: true, 
          thursday: true, 
          friday: true, 
          saturday: false, 
          sunday: false 
        },
        requirements: ['Vaccinated dogs only', 'Well-socialized pets'],
        includes: ['GPS tracking', 'Daily photos', 'Feeding if needed'],
        photos: [],
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'service_2',
        type: 'pet_sitting' as const,
        name: 'In-Home Pet Sitting',
        description: 'Caring pet sitter providing overnight care in your home, ensuring your pets stay comfortable in familiar surroundings.',
        provider: {
          id: 'provider_2',
          businessName: 'Cozy Home Pet Care',
          user: {
            id: 'user_2',
            firstName: 'Michael',
            lastName: 'Smith',
            email: 'michael@cozyhomepets.uk',
            role: 'service_provider' as const,
            isVerified: true,
            location: { type: 'Point' as const, coordinates: [-0.1276, 51.5074] as [number, number], city: 'London' },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          serviceTypes: ['pet_sitting', 'dog_walking'] as ServiceType[],
          description: 'Reliable pet sitter specializing in overnight care',
          experience: '3+ years',
          qualifications: ['DBS Checked', 'Pet Care Diploma'],
          averageRating: 4.9,
          totalReviews: 89,
          isVerified: true,
          isActive: true,
          serviceArea: { radius: 15, postcodes: ['N1', 'N7', 'NW1'] },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        price: { type: 'daily' as const, amount: 45, currency: 'GBP' as const },
        availability: { 
          monday: true, 
          tuesday: true, 
          wednesday: true, 
          thursday: true, 
          friday: true, 
          saturday: true, 
          sunday: true 
        },
        requirements: ['House key required', 'Emergency contact details'],
        includes: ['Daily updates', 'Basic house care', 'Plant watering'],
        photos: [],
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'service_3',
        type: 'grooming' as const,
        name: 'Mobile Pet Grooming',
        description: 'Professional grooming services brought to your door. Full wash, cut, and styling for dogs and cats.',
        provider: {
          id: 'provider_3',
          businessName: 'Pampered Pets Mobile',
          user: {
            id: 'user_3',
            firstName: 'Emma',
            lastName: 'Wilson',
            email: 'emma@pamperedpets.uk',
            role: 'service_provider' as const,
            isVerified: true,
            location: { type: 'Point' as const, coordinates: [-0.1276, 51.5074] as [number, number], city: 'London' },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          serviceTypes: ['grooming'] as ServiceType[],
          description: 'Professional mobile groomer with certified training',
          experience: '7+ years',
          qualifications: ['City & Guilds Certified', 'Mobile Grooming License'],
          averageRating: 4.7,
          totalReviews: 203,
          isVerified: true,
          isActive: true,
          serviceArea: { radius: 20, postcodes: ['SE1', 'SE11', 'SE16'] },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        price: { type: 'fixed' as const, amount: 65, currency: 'GBP' as const },
        duration: 2,
        availability: { 
          monday: true, 
          tuesday: true, 
          wednesday: true, 
          thursday: true, 
          friday: true, 
          saturday: true, 
          sunday: false 
        },
        requirements: ['Up-to-date vaccinations', 'Accessible parking'],
        includes: ['Wash & dry', 'Nail trimming', 'Ear cleaning', 'Teeth brushing'],
        photos: [],
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];

    // Apply filters
    let filtered = mockData;
    
    if (filters.type) {
      filtered = filtered.filter(service => service.type === filters.type);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filters.minRating) {
      filtered = filtered.filter(service => service.provider.averageRating >= filters.minRating!);
    }
    
    if (filters.verified) {
      filtered = filtered.filter(service => service.provider.isVerified);
    }

    return filtered;
  };

  const generateMockProviders = (): ServiceProvider[] => {
    const services = generateMockServices();
    return services.map(service => service.provider);
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setSelectedProvider(null);
    setShowBookingForm(true);
  };

  const handleBookProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setSelectedService(null);
    setShowBookingForm(true);
  };

  const handleBookingComplete = (booking: Booking) => {
    console.log('Booking completed:', booking);
    // You can add success handling here, such as showing a success message
    // or redirecting to a bookings page
  };

  const filteredData = viewMode === 'services' ? services : providers;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to browse services</h2>
          <p className="text-gray-600 mb-6">Find trusted pet care professionals in your area</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pet Services</h1>
          <p className="text-gray-600 mt-1">
            Find trusted pet care professionals in your area
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search services, providers, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ServiceFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-4"
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* View Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('services')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'services'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🛍️ Services
                  </button>
                  <button
                    onClick={() => setViewMode('providers')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'providers'
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    👥 Providers
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  {loading ? 'Loading...' : `${filteredData.length} result${filteredData.length !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {viewMode === 'services' 
                  ? (services as Service[]).map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onClick={() => handleBookService(service)}
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    ))
                  : (providers as ServiceProvider[]).map((provider) => (
                      <ServiceCard
                        key={provider.id}
                        provider={provider}
                        onClick={() => handleBookProvider(provider)}
                        className="hover:scale-105 transition-transform duration-200"
                      />
                    ))
                }
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {viewMode} found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                  }}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingForm && (selectedService || selectedProvider) && (
        <BookingForm
          service={selectedService || undefined}
          provider={selectedProvider || undefined}
          onBookingComplete={handleBookingComplete}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedService(null);
            setSelectedProvider(null);
          }}
        />
      )}
    </div>
  );
}