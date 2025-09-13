'use client';

import React from 'react';
import { Service, ServiceProvider } from '@/lib/api';

interface ServiceCardProps {
  service?: Service;
  provider?: ServiceProvider;
  onClick?: () => void;
  className?: string;
  showProvider?: boolean;
}

export default function ServiceCard({ 
  service, 
  provider, 
  onClick, 
  className = '', 
  showProvider = true 
}: ServiceCardProps) {
  const serviceProvider = service?.provider || provider;
  
  if (!serviceProvider) return null;

  const getServiceTypeIcon = (type: string) => {
    const icons = {
      dog_walking: '🚶‍♂️',
      pet_sitting: '🏠',
      grooming: '✂️',
      training: '🎓',
      veterinary: '🩺',
      boarding: '🛏️',
      daycare: '🏢',
      transport: '🚗'
    };
    return icons[type as keyof typeof icons] || '🐾';
  };

  const formatPrice = (price?: { type: string; amount: number; currency: string }) => {
    if (!price) return 'Price on request';
    
    const symbol = price.currency === 'GBP' ? '£' : price.currency;
    const suffix = price.type === 'hourly' ? '/hour' : price.type === 'daily' ? '/day' : '';
    
    return `${symbol}${price.amount}${suffix}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Service Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        {(service?.photos?.[0] || serviceProvider.photos?.[0]) ? (
          <img 
            src={service?.photos?.[0] || serviceProvider.photos?.[0]} 
            alt={service?.name || serviceProvider.businessName || 'Service'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">
              {service?.type ? getServiceTypeIcon(service.type) : '🐾'}
            </div>
          </div>
        )}
        
        {/* Service Type Badge */}
        {service?.type && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
              {getServiceTypeIcon(service.type)} {service.name}
            </span>
          </div>
        )}
        
        {/* Verified Badge */}
        {serviceProvider.isVerified && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Verified
            </span>
          </div>
        )}
      </div>

      {/* Service Details */}
      <div className="p-4">
        {/* Provider Name */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {serviceProvider.businessName || `${serviceProvider.user.firstName} ${serviceProvider.user.lastName}`}
          </h3>
          {service && (
            <p className="text-sm text-gray-600">{service.name}</p>
          )}
        </div>

        {/* Service Types */}
        {!service && serviceProvider.serviceTypes && (
          <div className="flex flex-wrap gap-1 mb-2">
            {serviceProvider.serviceTypes.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {getServiceTypeIcon(type)} {type.replace('_', ' ')}
              </span>
            ))}
            {serviceProvider.serviceTypes.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{serviceProvider.serviceTypes.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {service?.description || serviceProvider.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(serviceProvider.averageRating)}
            <span className="text-sm text-gray-600 ml-1">
              {serviceProvider.averageRating.toFixed(1)} ({serviceProvider.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Price and Location */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-purple-600">
            {service?.price ? formatPrice(service.price) : 
             serviceProvider.hourlyRate ? `£${serviceProvider.hourlyRate}/hour` : 
             'Price on request'}
          </div>
          
          {serviceProvider.user.location?.city && (
            <div className="text-sm text-gray-500">
              📍 {serviceProvider.user.location.city}
            </div>
          )}
        </div>

        {/* Experience */}
        {serviceProvider.experience && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              Experience: {serviceProvider.experience}
            </p>
          </div>
        )}

        {/* Qualifications */}
        {serviceProvider.qualifications && serviceProvider.qualifications.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {serviceProvider.qualifications.slice(0, 2).map((qual, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  🎓 {qual}
                </span>
              ))}
              {serviceProvider.qualifications.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{serviceProvider.qualifications.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability Status */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              serviceProvider.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {serviceProvider.isActive ? '🟢 Available' : '🔴 Unavailable'}
            </span>
            
            {service && (
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle book service
                }}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}