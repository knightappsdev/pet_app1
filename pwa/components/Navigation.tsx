'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'My Pets', href: '/pets', icon: '🐕', authRequired: true },
  { name: 'Health', href: '/health', icon: '💚', authRequired: true },
  { name: 'Services', href: '/services', icon: '🏥', authRequired: true },
  { name: 'Adoption', href: '/adoption', icon: '❤️' },
  { name: 'Shop', href: '/shop', icon: '🛍️' },
  { name: 'Emergency', href: '/emergency', icon: '🚨' },
  { name: 'Bookings', href: '/bookings', icon: '📅', authRequired: true },
];

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  const visibleItems = navigationItems.filter(item => 
    !item.authRequired || isAuthenticated
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className={`grid ${visibleItems.length <= 4 ? 'grid-cols-4' : visibleItems.length === 5 ? 'grid-cols-5' : 'grid-cols-3 sm:grid-cols-6'} max-w-2xl mx-auto`}>
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="font-medium truncate w-full text-center">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}