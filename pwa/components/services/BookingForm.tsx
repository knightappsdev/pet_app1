'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Service, ServiceProvider, PetProfile, BookingRequest, Booking } from '@/lib/api';

interface BookingFormProps {
  service?: Service;
  provider?: ServiceProvider;
  onBookingComplete: (booking: Booking) => void;
  onClose: () => void;
}

export default function BookingForm({ service, provider, onBookingComplete, onClose }: BookingFormProps) {
  const { user } = useAuth();
  const serviceProvider = service?.provider || provider;
  
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    petId: '',
    date: '',
    startTime: '09:00',
    duration: 1,
    notes: '',
    useMyAddress: true,
    location: {
      address: '',
      postcode: ''
    }
  });

  useEffect(() => {
    if (user) {
      loadUserPets();
      // Pre-fill location if user has address
      if (user.address && formData.useMyAddress) {
        const address = user.address;
        setFormData(prev => ({
          ...prev,
          location: {
            address: `${address.street || ''}, ${address.city || ''}`,
            postcode: address.postcode || ''
          }
        }));
      }
    }
  }, [user]);

  const loadUserPets = async () => {
    try {
      const userPets = await api.pets.getMyPets();
      setPets(userPets);
      if (userPets.length === 1) {
        setFormData(prev => ({ ...prev, petId: userPets[0].id }));
      }
    } catch (err) {
      console.error('Failed to load pets:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotalPrice = () => {
    if (!service?.price && !serviceProvider?.hourlyRate) return 0;
    
    const rate = service?.price?.amount || serviceProvider?.hourlyRate || 0;
    
    if (service?.price?.type === 'fixed') {
      return rate;
    } else if (service?.price?.type === 'daily') {
      return rate;
    } else {
      // Hourly rate
      return rate * formData.duration;
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service && !serviceProvider) {
      setError('No service selected');
      return;
    }
    
    if (!formData.petId) {
      setError('Please select a pet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData: BookingRequest = {
        serviceId: service?.id || `provider_${serviceProvider?.id}`,
        petId: formData.petId,
        date: formData.date,
        startTime: formData.startTime,
        duration: formData.duration,
        notes: formData.notes,
        location: formData.useMyAddress ? undefined : formData.location
      };

      const booking = await api.services.book(bookingData);
      onBookingComplete(booking);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!serviceProvider) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Service</h2>
            <p className="text-gray-600 mt-1">
              {service?.name || 'Service'} with {serviceProvider.businessName || serviceProvider.user.firstName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Pet Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pet *
            </label>
            {pets.length > 0 ? (
              <div className="space-y-2">
                {pets.map((pet) => (
                  <label key={pet.id} className="flex items-center">
                    <input
                      type="radio"
                      name="petId"
                      value={pet.id}
                      checked={formData.petId === pet.id}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <div className="ml-3 flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600 mr-2">
                        {pet.name[0]}
                      </div>
                      <div>
                        <span className="font-medium">{pet.name}</span>
                        <span className="text-gray-500 ml-2">({pet.species}, {pet.breed})</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>You need to add a pet first before booking services.</p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/pets'}
                  className="mt-2 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Add Pet →
                </button>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (hours) *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={1.5}>1.5 hours</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
              <option value={6}>6 hours</option>
              <option value={8}>8 hours (full day)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Service Location
            </label>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="useMyAddress"
                  checked={formData.useMyAddress}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Use my profile address
                </span>
              </label>
              
              {!formData.useMyAddress && (
                <div className="grid grid-cols-1 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="location.postcode"
                      value={formData.location.postcode}
                      onChange={handleInputChange}
                      placeholder="SW1A 1AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special instructions for the service provider..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{service?.name || 'Custom Service'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{formData.duration} hour{formData.duration !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{formData.startTime}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-purple-600">£{calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || pets.length === 0}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}