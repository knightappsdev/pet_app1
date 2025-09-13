'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { authApi, type User, type LoginRequest, type RegisterRequest, type UpdateProfileRequest } from '@/lib/api'

// Auth State Types
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }

// Auth Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: UpdateProfileRequest) => Promise<boolean>
  clearError: () => void
  checkAuthStatus: () => Promise<void>
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Check if user is authenticated
  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await authApi.getProfile()
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data })
      } else {
        // Token might be invalid, clear it
        authApi.logout()
        dispatch({ type: 'LOGOUT' })
      }
    } catch (error) {
      // Handle error silently for initial load
      authApi.logout()
      dispatch({ type: 'LOGOUT' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Login function
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })
      
      const response = await authApi.login(credentials)
      
      if (response.success && response.data) {
        // Store token and user data
        const { token, user } = response.data
        
        // Set token in localStorage (handled by authApi.login)
        dispatch({ type: 'SET_USER', payload: user })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Login failed' })
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Register function
  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })
      
      const response = await authApi.register(userData)
      
      if (response.success && response.data) {
        // Store token and user data
        const { token, user } = response.data
        
        dispatch({ type: 'SET_USER', payload: user })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Registration failed' })
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Logout function
  const logout = (): void => {
    authApi.logout()
    dispatch({ type: 'LOGOUT' })
  }

  // Update profile function
  const updateProfile = async (userData: UpdateProfileRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })
      
      const response = await authApi.updateProfile(userData)
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Profile update failed' })
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext