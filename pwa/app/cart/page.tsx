'use client'

import React, { useState, useEffect } from 'react'
import { api, ShoppingCart, CartItem } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CartPage() {
  const { user } = useAuth()
  const [cart, setCart] = useState<ShoppingCart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadCart = async () => {
    try {
      setLoading(true)
      const cartData = await api.ecommerce.getCart()
      setCart(cartData)
      if (cartData?.appliedCoupons) {
        setAppliedCoupons(cartData.appliedCoupons)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }

    try {
      setUpdating(itemId)
      const updatedCart = await api.ecommerce.updateCartItem(itemId, {
        quantity: newQuantity
      })
      setCart(updatedCart)
    } catch (error) {
      console.error('Failed to update quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId)
      const updatedCart = await api.ecommerce.removeFromCart(itemId)
      setCart(updatedCart)
    } catch (error) {
      console.error('Failed to remove item:', error)
      alert('Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    try {
      await api.ecommerce.clearCart()
      setCart(null)
    } catch (error) {
      console.error('Failed to clear cart:', error)
      alert('Failed to clear cart')
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      const updatedCart = await api.ecommerce.applyCoupon(couponCode.trim())
      setCart(updatedCart)
      setAppliedCoupons(updatedCart.appliedCoupons || [])
      setCouponCode('')
      alert('Coupon applied successfully!')
    } catch (error) {
      console.error('Failed to apply coupon:', error)
      alert('Invalid or expired coupon code')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
          <Link
            href="/auth/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        </div>

        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Cart Items ({cart.items.length})
                </h2>
                
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItemCard
                      key={item._id}
                      item={item}
                      onUpdateQuantity={(quantity) => updateQuantity(item._id, quantity)}
                      onRemove={() => removeItem(item._id)}
                      updating={updating === item._id}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">£{cart.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {cart.shippingCost === 0 ? 'Free' : `£${cart.shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {cart.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT</span>
                      <span className="text-gray-900">£{cart.tax.toFixed(2)}</span>
                    </div>
                  )}
                  
                  {cart.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-£{cart.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>£{cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {cart.estimatedDelivery && (
                  <p className="text-sm text-gray-600 mb-4">
                    Estimated delivery: {cart.estimatedDelivery}
                  </p>
                )}

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  
                  {appliedCoupons.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 font-medium">Applied coupons:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {appliedCoupons.map((coupon) => (
                          <span
                            key={coupon}
                            className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                          >
                            {coupon}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/shop"
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center block mt-3"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
  updating: boolean
}

function CartItemCard({ item, onUpdateQuantity, onRemove, updating }: CartItemCardProps) {
  return (
    <div className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg ${updating ? 'opacity-50' : ''}`}>
      <img
        src={item.product.images[0] || 'https://via.placeholder.com/80x80?text=Product'}
        alt={item.product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1">
        <Link
          href={`/shop/product/${item.product._id}`}
          className="font-medium text-gray-900 hover:text-blue-600"
        >
          {item.product.name}
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          £{item.price.toFixed(2)} each
        </p>
        {item.selectedVariation && (
          <div className="text-sm text-gray-500 mt-1">
            {Object.entries(item.selectedVariation)
              .filter(([_, value]) => value)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </div>
        )}
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(item.quantity - 1)}
          disabled={updating || item.quantity <= 1}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        
        <button
          onClick={() => onUpdateQuantity(item.quantity + 1)}
          disabled={updating}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          £{item.totalPrice.toFixed(2)}
        </p>
      </div>
      
      <button
        onClick={onRemove}
        disabled={updating}
        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  )
}