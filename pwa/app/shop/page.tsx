'use client'

import React, { useState, useEffect } from 'react'
import { api, Product } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { ShoppingCartIcon, HeartIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface ShopFilters {
  category?: string
  subcategory?: string
  petType?: string
  priceMin?: number
  priceMax?: number
  search?: string
  inStock?: boolean
}

export default function ShopPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number; subcategories?: { name: string; count: number }[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<number>(0)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ShopFilters>({})

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [filters, currentPage])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Load featured products and categories
      const [featured, cats, cart] = await Promise.all([
        api.ecommerce.getFeaturedProducts(8),
        api.ecommerce.getCategories(),
        user ? api.ecommerce.getCart() : null
      ])
      
      setFeaturedProducts(featured)
      setCategories(cats)
      setCartItems(cart?.items?.length || 0)

      // Load user wishlists if logged in
      if (user) {
        const wishlists = await api.ecommerce.getWishlists()
        const allWishlistProductIds = new Set<string>()
        wishlists.forEach(wishlist => {
          wishlist.products.forEach(product => {
            allWishlistProductIds.add(product._id)
          })
        })
        setWishlistIds(allWishlistProductIds)
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const result = await api.ecommerce.getProducts({
        ...filters,
        page: currentPage,
        limit: 12
      })
      
      setProducts(result.products)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const addToCart = async (productId: string) => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }

    try {
      const cart = await api.ecommerce.addToCart({
        productId,
        quantity: 1
      })
      setCartItems(cart.items.length)
      alert('Item added to cart!')
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add item to cart')
    }
  }

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert('Please login to manage wishlist')
      return
    }

    try {
      // For simplicity, use first wishlist or create default one
      const wishlists = await api.ecommerce.getWishlists()
      let wishlist = wishlists[0]
      
      if (!wishlist) {
        wishlist = await api.ecommerce.createWishlist('My Wishlist', 'Default wishlist', false)
      }

      if (wishlistIds.has(productId)) {
        await api.ecommerce.removeFromWishlist(wishlist._id, productId)
        setWishlistIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      } else {
        await api.ecommerce.addToWishlist(wishlist._id, productId)
        setWishlistIds(prev => new Set([...prev, productId]))
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error)
      alert('Failed to update wishlist')
    }
  }

  const applyFilters = (newFilters: ShopFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Pet Shop</h1>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
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
              
              {/* Cart */}
              {user && (
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value || undefined }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="food">Food & Treats</option>
                  <option value="toys">Toys & Entertainment</option>
                  <option value="accessories">Accessories</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="grooming">Grooming</option>
                  <option value="training">Training</option>
                </select>
              </div>

              {/* Pet Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                <select
                  value={filters.petType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, petType: e.target.value || undefined }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Pets</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                  <option value="bird">Birds</option>
                  <option value="fish">Fish</option>
                  <option value="rabbit">Rabbits</option>
                  <option value="hamster">Hamsters</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-end space-x-2">
                <button
                  onClick={() => applyFilters(filters)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Products */}
        {featuredProducts.length > 0 && !Object.keys(filters).length && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isInWishlist={wishlistIds.has(product._id)}
                  onAddToCart={() => addToCart(product._id)}
                  onToggleWishlist={() => toggleWishlist(product._id)}
                  showWishlist={!!user}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {Object.keys(filters).length ? 'Search Results' : 'All Products'}
            </h2>
            <p className="text-gray-600">{products.length} products found</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters to see all products
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isInWishlist={wishlistIds.has(product._id)}
                    onAddToCart={() => addToCart(product._id)}
                    onToggleWishlist={() => toggleWishlist(product._id)}
                    showWishlist={!!user}
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

interface ProductCardProps {
  product: Product
  isInWishlist: boolean
  onAddToCart: () => void
  onToggleWishlist: () => void
  showWishlist: boolean
}

function ProductCard({ product, isInWishlist, onAddToCart, onToggleWishlist, showWishlist }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/shop/product/${product._id}`}>
        <div className="relative">
          <img
            src={product.images[0] || 'https://via.placeholder.com/300x200?text=Product+Image'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Sale
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate flex-1">{product.name}</h3>
          {showWishlist && (
            <button
              onClick={onToggleWishlist}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              {isInWishlist ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.ratings.average)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.ratings.count})</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">£{product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">£{product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          <button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}