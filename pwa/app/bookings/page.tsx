'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api, Booking, Review } from '@/lib/api';

export default function BookingsPage() {
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      // For now, generate mock bookings since backend is basic
      const mockBookings = generateMockBookings();
      setBookings(mockBookings);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockBookings = (): Booking[] => {
    return [
      {
        id: 'booking_1',
        service: {
          id: 'service_1',
          type: 'dog_walking',
          name: 'Professional Dog Walking',
          description: 'Experienced dog walker',
          provider: {
            id: 'provider_1',
            businessName: 'Happy Paws Walking',
            user: {
              id: 'user_1',
              firstName: 'Sarah',
              lastName: 'Johnson',
              email: 'sarah@happypaws.uk',
              role: 'service_provider',
              isVerified: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            },
            serviceTypes: ['dog_walking'],
            description: 'Professional dog walking service',
            averageRating: 4.8,
            totalReviews: 127,
            isVerified: true,
            isActive: true,
            serviceArea: { radius: 10, postcodes: ['SW1'] },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          price: { type: 'hourly', amount: 20, currency: 'GBP' },
          availability: {},
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        customer: user!,
        pet: {
          id: 'pet_1',
          owner: user!,
          name: 'Max',
          species: 'Dog',
          breed: 'Golden Retriever',
          gender: 'Male',
          isNeutered: true,
          isVaccinated: true,
          isPublicProfile: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        date: new Date('2024-12-20'),
        startTime: '10:00',
        duration: 1,
        totalPrice: 20,
        status: 'upcoming',
        location: {
          address: '123 Park Lane',
          postcode: 'SW1A 1AA'
        },
        createdAt: '2024-12-12',
        updatedAt: '2024-12-12'
      },
      {
        id: 'booking_2',
        service: {
          id: 'service_2',
          type: 'grooming',
          name: 'Mobile Pet Grooming',
          description: 'Professional grooming',
          provider: {
            id: 'provider_2',
            businessName: 'Pampered Pets Mobile',
            user: {
              id: 'user_2',
              firstName: 'Emma',
              lastName: 'Wilson',
              email: 'emma@pamperedpets.uk',
              role: 'service_provider',
              isVerified: true,
              createdAt: '2024-01-01',
              updatedAt: '2024-01-01'
            },
            serviceTypes: ['grooming'],
            description: 'Mobile grooming service',
            averageRating: 4.7,
            totalReviews: 203,
            isVerified: true,
            isActive: true,
            serviceArea: { radius: 20, postcodes: ['SE1'] },
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01'
          },
          price: { type: 'fixed', amount: 65, currency: 'GBP' },
          availability: {},
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        customer: user!,
        pet: {
          id: 'pet_1',
          owner: user!,
          name: 'Max',
          species: 'Dog',
          breed: 'Golden Retriever',
          gender: 'Male',
          isNeutered: true,
          isVaccinated: true,
          isPublicProfile: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        date: new Date('2024-12-10'),
        startTime: '14:00',
        duration: 2,
        totalPrice: 65,
        status: 'completed',
        location: {
          address: '123 Park Lane',
          postcode: 'SW1A 1AA'
        },
        createdAt: '2024-12-01',
        updatedAt: '2024-12-10'
      }
    ] as Booking[];
  };

  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      upcoming: 'bg-green-100 text-green-800',
      ongoing: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800'
    };

    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      upcoming: 'Upcoming',
      ongoing: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      refunded: 'Refunded'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.services.cancelBooking(bookingId, 'User requested cancellation');
      // Refresh bookings
      loadBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await api.services.addReview(selectedBooking.id, reviewData);
      setShowReviewForm(false);
      setSelectedBooking(null);
      setReviewData({ rating: 5, title: '', comment: '' });
      // Refresh bookings to show review status
      loadBookings();
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['pending', 'confirmed', 'upcoming'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    if (filter === 'cancelled') return ['cancelled', 'refunded'].includes(booking.status);
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view bookings</h2>
          <p className="text-gray-600 mb-6">Manage your pet service appointments</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage your pet service appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bookings', count: bookings.length },
                { key: 'upcoming', label: 'Upcoming', count: bookings.filter(b => ['pending', 'confirmed', 'upcoming'].includes(b.status)).length },
                { key: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: bookings.filter(b => ['cancelled', 'refunded'].includes(b.status)).length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    filter === key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.service.name}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-medium">Provider:</span> {booking.service.provider.businessName}
                        </p>
                        <p>
                          <span className="font-medium">Pet:</span> {booking.pet.name} ({booking.pet.species})
                        </p>
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(booking.date)} at {formatTime(booking.startTime)}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span> {booking.duration} hour{booking.duration !== 1 ? 's' : ''}
                        </p>
                        {booking.location && (
                          <p>
                            <span className="font-medium">Location:</span> {booking.location.address}, {booking.location.postcode}
                          </p>
                        )}
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        £{booking.totalPrice.toFixed(2)}
                      </div>
                      
                      <div className="space-y-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="block w-full px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            Cancel
                          </button>
                        )}
                        
                        {booking.status === 'completed' && !booking.review && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowReviewForm(true);
                            }}
                            className="block w-full px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                          >
                            Leave Review
                          </button>
                        )}
                        
                        {booking.review && (
                          <div className="text-sm text-green-600 font-medium">
                            ✓ Reviewed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filter === 'all' ? '' : filter} bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet. Browse our services to get started!"
                : `You don't have any ${filter} bookings.`
              }
            </p>
            <a
              href="/services"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700"
            >
              Browse Services
            </a>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewForm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Leave a Review</h2>
              <p className="text-gray-600 mt-1">
                How was your experience with {selectedBooking.service.provider.businessName}?
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: i + 1 }))}
                      className={`text-2xl ${
                        i < reviewData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title (Optional)
                </label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Great service!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  placeholder="Tell others about your experience..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setSelectedBooking(null);
                    setReviewData({ rating: 5, title: '', comment: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}