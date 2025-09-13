const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  role: 'user' | 'service_provider' | 'vet' | 'rescue_center' | 'admin'
  isVerified: boolean
  address?: {
    street?: string
    city?: string
    county?: string
    postcode?: string
    country?: string
  }
  location?: {
    type: 'Point'
    coordinates: [number, number]
    city?: string
    county?: string
  }
  preferences?: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private'
      showLocation: boolean
      showPhone: boolean
    }
    language: string
    currency: string
  }
  serviceTypes?: string[]
  hourlyRate?: number
  averageRating?: number
  totalReviews?: number
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
  address?: {
    street?: string
    city?: string
    county?: string
    postcode?: string
  }
  preferences?: {
    notifications?: {
      email?: boolean
      push?: boolean
      sms?: boolean
    }
    privacy?: {
      profileVisibility?: 'public' | 'private'
      showLocation?: boolean
      showPhone?: boolean
    }
  }
}

// Pet Profile Interface
export interface PetProfile {
  id: string
  owner: User
  name: string
  species: string
  breed?: string
  dateOfBirth?: Date
  gender: 'Male' | 'Female'
  weight?: number
  size?: string
  color?: string
  microchipId?: string
  description?: string
  photos?: string[]
  medicalConditions?: string
  allergies?: string
  specialNeeds?: string
  isNeutered: boolean
  isVaccinated: boolean
  isPublicProfile: boolean
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  healthRecords?: HealthRecord[]
  vaccinationRecords?: VaccinationRecord[]
  createdAt: string
  updatedAt: string
}

// Health Record Interface
export interface HealthRecord {
  id: string
  pet: string
  date: Date
  type: 'checkup' | 'illness' | 'injury' | 'surgery' | 'medication' | 'other'
  vetName?: string
  vetClinic?: string
  diagnosis?: string
  treatment?: string
  medications?: string
  notes?: string
  followUpDate?: Date
  cost?: number
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

// Vaccination Record Interface
export interface VaccinationRecord {
  id: string
  pet: string
  vaccineName: string
  dateGiven: Date
  nextDueDate?: Date
  vetName?: string
  vetClinic?: string
  batchNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Pet Create/Update Request
export interface PetRequest {
  name: string
  species: string
  breed?: string
  dateOfBirth?: Date
  gender: 'Male' | 'Female'
  weight?: number
  size?: string
  color?: string
  microchipId?: string
  description?: string
  medicalConditions?: string
  allergies?: string
  specialNeeds?: string
  isNeutered?: boolean
  isVaccinated?: boolean
  isPublicProfile?: boolean
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

// Service Provider Interface
export interface ServiceProvider {
  id: string
  user: User
  businessName?: string
  serviceTypes: ServiceType[]
  description: string
  experience?: string
  qualifications?: string[]
  hourlyRate?: number
  availability?: {
    [key: string]: {
      start: string
      end: string
      available: boolean
    }
  }
  serviceArea: {
    radius: number
    postcodes: string[]
  }
  photos?: string[]
  reviews?: Review[]
  averageRating: number
  totalReviews: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Service Type
export type ServiceType = 'dog_walking' | 'pet_sitting' | 'grooming' | 'training' | 'veterinary' | 'boarding' | 'daycare' | 'transport'

// Service Interface
export interface Service {
  id: string
  type: ServiceType
  name: string
  description: string
  provider: ServiceProvider
  duration?: number
  price: {
    type: 'fixed' | 'hourly' | 'daily'
    amount: number
    currency: 'GBP'
  }
  location?: {
    address?: string
    postcode?: string
    coordinates?: [number, number]
  }
  availability: {
    [key: string]: boolean
  }
  requirements?: string[]
  includes?: string[]
  photos?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Booking Interface
export interface Booking {
  id: string
  service: Service
  customer: User
  pet: PetProfile
  date: Date
  startTime: string
  endTime?: string
  duration: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'refunded'
  notes?: string
  customerNotes?: string
  providerNotes?: string
  location?: {
    address: string
    postcode: string
    coordinates?: [number, number]
  }
  payment?: {
    method: string
    status: 'pending' | 'paid' | 'refunded'
    transactionId?: string
  }
  review?: Review
  createdAt: string
  updatedAt: string
}

// Review Interface
export interface Review {
  id: string
  booking?: string
  service?: string
  provider?: string
  reviewer: User
  rating: number
  title?: string
  comment?: string
  photos?: string[]
  response?: {
    comment: string
    date: Date
  }
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Service Search Filters
export interface ServiceFilters {
  type?: ServiceType
  location?: string
  postcode?: string
  radius?: number
  date?: string
  time?: string
  minRating?: number
  maxPrice?: number
  verified?: boolean
  availability?: boolean
}

// Booking Request
export interface BookingRequest {
  serviceId: string
  petId: string
  date: string
  startTime: string
  duration: number
  notes?: string
  location?: {
    address: string
    postcode: string
  }
}

// Social Post Interface
export interface SocialPost {
  id: string
  author: User
  pet?: PetProfile
  content: string
  images?: string[]
  type: 'general' | 'advice' | 'playdate' | 'lost_found' | 'celebration' | 'question'
  tags?: string[]
  location?: {
    city?: string
    coordinates?: [number, number]
  }
  likes: number
  comments: Comment[]
  shares: number
  isLiked?: boolean
  visibility: 'public' | 'friends' | 'private'
  createdAt: string
  updatedAt: string
}

// Comment Interface
export interface Comment {
  id: string
  author: User
  content: string
  parentComment?: string
  replies?: Comment[]
  likes: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

// Community Group Interface
export interface CommunityGroup {
  id: string
  name: string
  description: string
  avatar?: string
  coverImage?: string
  type: 'breed' | 'location' | 'interest' | 'activity' | 'support'
  category: string
  memberCount: number
  isPublic: boolean
  location?: {
    city?: string
    county?: string
    country?: string
  }
  rules?: string[]
  moderators: User[]
  tags?: string[]
  createdBy: User
  isMember?: boolean
  membershipStatus?: 'member' | 'pending' | 'invited' | 'banned'
  createdAt: string
  updatedAt: string
}

// Playdate Interface
export interface Playdate {
  id: string
  organizer: User
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
    postcode: string
    coordinates?: [number, number]
  }
  maxParticipants?: number
  participants: {
    user: User
    pets: PetProfile[]
    status: 'attending' | 'maybe' | 'declined'
    joinedAt: Date
  }[]
  requirements?: {
    species?: string[]
    ageRange?: {
      min: number
      max: number
    }
    vaccinated?: boolean
    neutered?: boolean
    size?: string[]
  }
  tags?: string[]
  isPublic: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// Social Connection Interface
export interface SocialConnection {
  id: string
  requester: User
  recipient: User
  status: 'pending' | 'accepted' | 'declined' | 'blocked'
  connectionType: 'friend' | 'follow' | 'neighbor'
  commonInterests?: string[]
  mutualConnections?: number
  createdAt: string
  updatedAt: string
}

// Social Notification Interface
export interface SocialNotification {
  id: string
  recipient: string
  sender?: User
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'playdate_invite' | 'group_invite' | 'mention'
  content: string
  relatedPost?: string
  relatedPlaydate?: string
  relatedGroup?: string
  isRead: boolean
  createdAt: string
}

// Post Creation Request
export interface CreatePostRequest {
  content: string
  petId?: string
  images?: File[]
  type?: SocialPost['type']
  tags?: string[]
  location?: {
    city?: string
    coordinates?: [number, number]
  }
  visibility?: SocialPost['visibility']
}

// Playdate Creation Request
export interface CreatePlaydateRequest {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
    postcode: string
  }
  maxParticipants?: number
  requirements?: Playdate['requirements']
  tags?: string[]
  isPublic?: boolean
}

// E-commerce Interfaces
export interface Product {
  _id: string
  name: string
  description: string
  category: 'food' | 'toys' | 'accessories' | 'healthcare' | 'grooming' | 'training' | 'other'
  subcategory?: string
  brand?: string
  images: string[]
  price: number
  originalPrice?: number
  currency: string
  inStock: boolean
  stockQuantity: number
  minOrderQuantity: number
  maxOrderQuantity?: number
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  petTypes: ('dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'other')[]
  ageGroups?: ('puppy' | 'adult' | 'senior')[]
  features?: string[]
  ingredients?: string[]
  nutritionalInfo?: {
    protein?: number
    fat?: number
    fiber?: number
    moisture?: number
    calories?: number
  }
  tags: string[]
  ratings: {
    average: number
    count: number
  }
  reviews: ProductReview[]
  vendor: {
    id: string
    name: string
    rating: number
  }
  shippingInfo: {
    freeShippingThreshold?: number
    shippingCost: number
    estimatedDelivery: string
    availableRegions: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface ProductReview {
  _id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  content: string
  images?: string[]
  verifiedPurchase: boolean
  helpful: number
  createdAt: string
}

export interface CartItem {
  _id: string
  productId: string
  product: Product
  quantity: number
  selectedVariation?: {
    size?: string
    color?: string
    flavor?: string
  }
  price: number
  totalPrice: number
}

export interface ShoppingCart {
  _id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  currency: string
  appliedCoupons?: string[]
  discountAmount: number
  estimatedDelivery?: string
  updatedAt: string
}

export interface Order {
  _id: string
  userId: string
  orderNumber: string
  items: CartItem[]
  subtotal: number
  shippingCost: number
  tax: number
  discountAmount: number
  total: number
  currency: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    county?: string
    postcode: string
    country: string
    phone: string
  }
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank_transfer'
    last4?: string
    brand?: string
  }
  tracking?: {
    carrier: string
    trackingNumber: string
    trackingUrl: string
  }
  estimatedDelivery: string
  actualDelivery?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Wishlist {
  _id: string
  userId: string
  name: string
  description?: string
  isPublic: boolean
  products: Product[]
  createdAt: string
  updatedAt: string
}

// E-commerce Request Types
export interface AddToCartRequest {
  productId: string
  quantity: number
  selectedVariation?: {
    size?: string
    color?: string
    flavor?: string
  }
}

export interface UpdateCartItemRequest {
  quantity: number
  selectedVariation?: {
    size?: string
    color?: string
    flavor?: string
  }
}

export interface CreateOrderRequest {
  shippingAddress: {
    fullName: string
    addressLine1: string
    addressLine2?: string
    city: string
    county?: string
    postcode: string
    country: string
    phone: string
  }
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank_transfer'
    token?: string
  }
  notes?: string
}

export interface CreateReviewRequest {
  productId: string
  rating: number
  title?: string
  content: string
  images?: File[]
}

// Adoption Interfaces
export interface AdoptionListing {
  _id: string
  petName: string
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'other'
  breed: string
  age: {
    years: number
    months: number
  }
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large' | 'extra_large'
  weight?: number
  description: string
  personalityTraits: string[]
  goodWith: {
    children: boolean
    cats: boolean
    dogs: boolean
    otherPets: boolean
  }
  specialNeeds?: string[]
  medicalHistory: {
    vaccinated: boolean
    neutered: boolean
    microchipped: boolean
    healthIssues?: string[]
    medications?: string[]
  }
  images: string[]
  videos?: string[]
  adoptionFee: number
  currency: string
  shelter: {
    id: string
    name: string
    address: string
    city: string
    county?: string
    postcode: string
    phone: string
    email: string
    website?: string
    rating: number
    verified: boolean
  }
  location: {
    coordinates: [number, number]
    address: string
    city: string
    county?: string
    postcode: string
  }
  requirements?: string[]
  story?: string
  emergencyContact?: {
    name: string
    phone: string
    email: string
  }
  status: 'available' | 'pending' | 'adopted' | 'on_hold' | 'not_available'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  datePosted: string
  lastUpdated: string
  viewCount: number
  favoriteCount: number
  applicationCount: number
  featured?: boolean
}

export interface AdoptionApplication {
  _id: string
  petId: string
  pet: AdoptionListing
  applicantId: string
  applicant: User
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  
  // Personal Information
  personalInfo: {
    fullName: string
    dateOfBirth: string
    occupation: string
    phoneNumber: string
    email: string
    address: {
      line1: string
      line2?: string
      city: string
      county?: string
      postcode: string
      country: string
    }
  }
  
  // Housing Information
  housingInfo: {
    type: 'house' | 'apartment' | 'flat' | 'bungalow' | 'other'
    ownership: 'own' | 'rent' | 'live_with_family'
    landlordPermission?: boolean
    hasGarden: boolean
    gardenSize?: 'small' | 'medium' | 'large'
    gardenSecure?: boolean
    otherPets: {
      hasPets: boolean
      pets?: {
        type: string
        breed?: string
        age: number
        neutered: boolean
      }[]
    }
  }
  
  // Experience and Lifestyle
  experience: {
    previousPets: boolean
    petExperience?: string
    currentPets?: string
    petCareKnowledge: string
    dailyRoutine: string
    exerciseCommitment: string
    trainingApproach: string
  }
  
  // References
  references: {
    veterinarian?: {
      name: string
      practice: string
      phone: string
      email?: string
    }
    personal: {
      name: string
      relationship: string
      phone: string
      email?: string
      yearsKnown: number
    }[]
  }
  
  // Additional Information
  additionalInfo: {
    motivation: string
    expectations: string
    contingencyPlan: string
    timeCommitment: string
    financialPreparedness: boolean
    emergencyVetFund: boolean
    agreesToHomeVisit: boolean
    agreesToFollowUp: boolean
  }
  
  adminNotes?: string
  rejectionReason?: string
}

export interface AdoptionFavorite {
  _id: string
  userId: string
  petId: string
  pet: AdoptionListing
  addedAt: string
  notes?: string
}

// Adoption Request Types
export interface AdoptionApplicationRequest {
  petId: string
  personalInfo: AdoptionApplication['personalInfo']
  housingInfo: AdoptionApplication['housingInfo']
  experience: AdoptionApplication['experience']
  references: AdoptionApplication['references']
  additionalInfo: AdoptionApplication['additionalInfo']
}

export interface AdoptionFilters {
  species?: string
  breed?: string
  ageMin?: number
  ageMax?: number
  size?: string
  gender?: string
  goodWithChildren?: boolean
  goodWithCats?: boolean
  goodWithDogs?: boolean
  location?: string
  maxDistance?: number
  adoptionFeeMax?: number
  urgency?: string
  specialNeeds?: boolean
  search?: string
  page?: number
  limit?: number
}

// Emergency Services Interfaces
export interface EmergencyService {
  _id: string
  name: string
  type: 'veterinary' | 'animal_hospital' | 'emergency_vet' | 'poison_control' | 'animal_rescue' | 'mobile_vet'
  description: string
  specialties: string[]
  isAvailable24h: boolean
  currentStatus: 'open' | 'closed' | 'emergency_only' | 'busy' | 'unknown'
  
  contact: {
    phone: string
    emergencyPhone?: string
    email?: string
    website?: string
  }
  
  location: {
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      county?: string
      postcode: string
      country: string
    }
    coordinates: [number, number]
    accessibility?: {
      wheelchairAccessible: boolean
      parkingAvailable: boolean
      publicTransport: boolean
    }
  }
  
  services: {
    emergencyCare: boolean
    surgery: boolean
    diagnostics: boolean
    pharmacy: boolean
    grooming: boolean
    boarding: boolean
    petTaxi: boolean
  }
  
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      isEmergencyOnly?: boolean
    }
  }
  
  pricing: {
    consultationFee?: number
    emergencyFee?: number
    currency: string
    acceptsInsurance: boolean
    paymentMethods: string[]
  }
  
  ratings: {
    average: number
    count: number
    breakdown: {
      service: number
      staff: number
      facilities: number
      value: number
    }
  }
  
  verification: {
    isVerified: boolean
    licenseNumber?: string
    accreditations: string[]
  }
  
  responseTime?: {
    average: number // in minutes
    emergency: number // in minutes
  }
  
  distance?: number // calculated distance from user
  estimatedArrival?: string // for mobile services
  
  createdAt: string
  updatedAt: string
}

export interface EmergencyRequest {
  _id: string
  userId: string
  user: User
  petId?: string
  pet?: PetProfile
  
  emergency: {
    type: 'injury' | 'poisoning' | 'breathing_difficulty' | 'seizure' | 'unconscious' | 'bleeding' | 'allergic_reaction' | 'other'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    symptoms: string[]
    duration: string
    photos?: string[]
    vitals?: {
      temperature?: number
      heartRate?: number
      breathing?: 'normal' | 'fast' | 'slow' | 'labored'
      consciousness?: 'alert' | 'drowsy' | 'unconscious'
    }
  }
  
  location: {
    type: 'Point'
    coordinates: [number, number]
    address?: string
    landmark?: string
    accessibility?: string
  }
  
  requestedServices: string[]
  preferredServiceType: EmergencyService['type']
  
  status: 'submitted' | 'accepted' | 'en_route' | 'arrived' | 'treating' | 'completed' | 'cancelled'
  
  assignedService?: {
    serviceId: string
    service: EmergencyService
    acceptedAt: string
    estimatedArrival: string
    actualArrival?: string
    responderName?: string
    responderPhone?: string
    vehicleInfo?: string
  }
  
  timeline: {
    timestamp: string
    status: EmergencyRequest['status']
    message: string
    location?: [number, number]
  }[]
  
  notes?: string
  adminNotes?: string
  followUpRequired: boolean
  
  createdAt: string
  updatedAt: string
}

export interface EmergencyContact {
  _id: string
  userId: string
  name: string
  relationship: string
  phone: string
  email?: string
  isEmergencyVet: boolean
  isPrimary: boolean
  notes?: string
  createdAt: string
}

export interface PoisonInfo {
  _id: string
  substance: string
  category: 'food' | 'plant' | 'chemical' | 'medication' | 'other'
  dangerLevel: 'safe' | 'caution' | 'toxic' | 'deadly'
  species: string[] // which animals affected
  symptoms: string[]
  immediateActions: string[]
  contraindications: string[]
  antidote?: string
  vetRequired: boolean
  description: string
  sources: string[]
  lastUpdated: string
}

export interface FirstAidGuide {
  _id: string
  title: string
  category: 'breathing' | 'bleeding' | 'poisoning' | 'trauma' | 'seizure' | 'choking' | 'burns' | 'other'
  species: string[]
  severity: FirstAidGuide['category']
  
  steps: {
    stepNumber: number
    title: string
    description: string
    warning?: string
    images?: string[]
    video?: string
  }[]
  
  supplies: string[]
  whenToSeekHelp: string[]
  prevention: string[]
  
  author: {
    name: string
    credentials: string
    verified: boolean
  }
  
  ratings: {
    helpful: number
    notHelpful: number
  }
  
  createdAt: string
  updatedAt: string
}

// Health Reminder Interface
export interface HealthReminder {
  id: string
  petId: string
  type: 'medication' | 'vaccination' | 'checkup' | 'grooming' | 'weight_check' | 'other'
  title: string
  description?: string
  dueDate: Date
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  isRecurring: boolean
  isCompleted: boolean
  completedAt?: Date
  reminderDays: number // days before due date to remind
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
}

// Health Statistics Interface
export interface HealthStats {
  totalRecords: number
  recentCheckups: number
  vaccinationsUpToDate: number
  upcomingReminders: number
  healthScore: number // 0-100 calculated score
}

// Weight Record Interface
export interface WeightRecord {
  id: string
  petId: string
  weight: number // in kg
  date: Date
  notes?: string
  recordedBy?: string
  createdAt: string
}

// Veterinarian Listing Interface
export interface VeterinarianListing {
  _id: string
  name: string
  clinicName: string
  specialties: string[]
  qualifications: string[]
  yearsExperience: number
  
  contact: {
    phone: string
    email: string
    website?: string
  }
  
  address: {
    street: string
    city: string
    county: string
    postcode: string
    country: string
  }
  
  location: {
    coordinates: [number, number]
  }
  
  services: {
    consultations: boolean
    surgery: boolean
    diagnostics: boolean
    emergency: boolean
    houseCalls: boolean
    grooming: boolean
  }
  
  availability: {
    [day: string]: {
      start: string
      end: string
      isAvailable: boolean
    }
  }
  
  pricing: {
    consultationFee: number
    emergencyFee?: number
    currency: string
    acceptsInsurance: boolean
  }
  
  ratings: {
    average: number
    count: number
    reviews: VetReview[]
  }
  
  isVerified: boolean
  isAcceptingNewPatients: boolean
  distance?: number // calculated from user location
  
  createdAt: string
  updatedAt: string
}

// Vet Review Interface
export interface VetReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  serviceType: string
  visitDate: Date
  verified: boolean
  createdAt: string
}

// Vet Appointment Interface
export interface VetAppointment {
  _id: string
  userId: string
  petId: string
  vetId: string
  vet: VeterinarianListing
  pet: PetProfile
  
  appointmentType: 'checkup' | 'vaccination' | 'surgery' | 'emergency' | 'consultation' | 'follow_up'
  reason: string
  symptoms?: string[]
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  
  scheduledDate: Date
  duration: number // in minutes
  
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  
  notes?: string
  vetNotes?: string
  diagnosis?: string
  treatment?: string
  prescription?: string
  followUpRequired: boolean
  followUpDate?: Date
  
  cost?: number
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded'
  
  reminders: {
    email: boolean
    sms: boolean
    daysBefore: number[]
  }
  
  createdAt: string
  updatedAt: string
}

// Vet Appointment Request Interface
export interface VetAppointmentRequest {
  vetId: string
  petId: string
  appointmentType: VetAppointment['appointmentType']
  reason: string
  symptoms?: string[]
  urgency: VetAppointment['urgency']
  preferredDate: Date
  preferredTime?: string
  duration?: number
  notes?: string
  reminders?: {
    email?: boolean
    sms?: boolean
    daysBefore?: number[]
  }
}

// Health Insight Interface
export interface HealthInsight {
  id: string
  petId: string
  type: 'vaccination_due' | 'weight_trend' | 'checkup_overdue' | 'medication_reminder' | 'health_tip'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  actionRequired: boolean
  actionLabel?: string
  actionUrl?: string
  isRead: boolean
  expiresAt?: Date
  createdAt: string
}

// Emergency Request Types
export interface CreateEmergencyRequest {
  petId?: string
  emergency: {
    type: EmergencyRequest['emergency']['type']
    severity: EmergencyRequest['emergency']['severity']
    description: string
    symptoms: string[]
    duration: string
    photos?: File[]
    vitals?: EmergencyRequest['emergency']['vitals']
  }
  location: {
    coordinates: [number, number]
    address?: string
    landmark?: string
    accessibility?: string
  }
  requestedServices: string[]
  preferredServiceType: EmergencyService['type']
  notes?: string
}

export interface EmergencyFilters {
  type?: EmergencyService['type']
  isAvailable24h?: boolean
  currentStatus?: EmergencyService['currentStatus']
  services?: string[]
  maxDistance?: number
  acceptsInsurance?: boolean
  minRating?: number
  location?: {
    coordinates: [number, number]
    radius: number // in kilometers
  }
}

// Helper function to get stored token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('authToken')
}

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token)
  }
}

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken')
  }
}

// Generic API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken()
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error('API Request Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }
}

// Auth API functions
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiRequest('/api/auth/profile')
  },

  // Update user profile
  updateProfile: async (userData: UpdateProfileRequest): Promise<ApiResponse<User>> => {
    return apiRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  // Reset password request
  resetPassword: async (email: string): Promise<ApiResponse> => {
    return apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // Confirm reset password with token
  confirmResetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    return apiRequest(`/api/auth/reset-password/${token}`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    })
  },

  // Logout (client-side only)
  logout: (): void => {
    removeAuthToken()
  }
}

// Pet API functions
export const pets = {
  // Get all pets for current user
  getMyPets: async (): Promise<PetProfile[]> => {
    const response = await apiRequest<PetProfile[]>('/api/pets')
    return response.data || []
  },

  // Get single pet
  get: async (id: string): Promise<PetProfile | null> => {
    const response = await apiRequest<PetProfile>(`/api/pets/${id}`)
    return response.data || null
  },

  // Create new pet
  create: async (petData: PetRequest): Promise<PetProfile> => {
    const response = await apiRequest<PetProfile>('/api/pets', {
      method: 'POST',
      body: JSON.stringify(petData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create pet')
    }
    return response.data
  },

  // Update pet
  update: async (id: string, petData: Partial<PetRequest>): Promise<PetProfile> => {
    const response = await apiRequest<PetProfile>(`/api/pets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update pet')
    }
    return response.data
  },

  // Delete pet
  delete: async (id: string): Promise<void> => {
    const response = await apiRequest(`/api/pets/${id}`, {
      method: 'DELETE',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete pet')
    }
  },

  // Add health record
  addHealthRecord: async (petId: string, healthData: Partial<HealthRecord>): Promise<HealthRecord> => {
    const response = await apiRequest<HealthRecord>(`/api/pets/${petId}/health`, {
      method: 'POST',
      body: JSON.stringify(healthData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add health record')
    }
    return response.data
  },

  // Upload pet photo
  uploadPhoto: async (petId: string, formData: FormData): Promise<string[]> => {
    const token = getAuthToken()
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/pets/${petId}/photos`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data.data || []
    } catch (error) {
      console.error('Photo Upload Error:', error)
      throw new Error('Failed to upload photo')
    }
  }
}

// Services API functions
export const services = {
  // Get all services with filters
  getAll: async (filters?: ServiceFilters): Promise<Service[]> => {
    const queryParams = new URLSearchParams()
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.location) queryParams.append('location', filters.location)
    if (filters?.postcode) queryParams.append('postcode', filters.postcode)
    if (filters?.radius) queryParams.append('radius', filters.radius.toString())
    if (filters?.date) queryParams.append('date', filters.date)
    if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString())
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString())
    if (filters?.verified !== undefined) queryParams.append('verified', filters.verified.toString())
    
    const queryString = queryParams.toString()
    const response = await apiRequest<Service[]>(`/api/services${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Get service by ID
  get: async (id: string): Promise<Service | null> => {
    const response = await apiRequest<Service>(`/api/services/${id}`)
    return response.data || null
  },

  // Get service providers
  getProviders: async (filters?: { type?: ServiceType; location?: string }): Promise<ServiceProvider[]> => {
    const queryParams = new URLSearchParams()
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.location) queryParams.append('location', filters.location)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<ServiceProvider[]>(`/api/services/providers${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Book service
  book: async (bookingData: BookingRequest): Promise<Booking> => {
    const response = await apiRequest<Booking>('/api/services/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to book service')
    }
    return response.data
  },

  // Get user bookings
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await apiRequest<Booking[]>('/api/services/bookings')
    return response.data || []
  },

  // Get booking by ID
  getBooking: async (id: string): Promise<Booking | null> => {
    const response = await apiRequest<Booking>(`/api/services/bookings/${id}`)
    return response.data || null
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string): Promise<void> => {
    const response = await apiRequest(`/api/services/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel booking')
    }
  },

  // Add service review
  addReview: async (bookingId: string, reviewData: {
    rating: number
    title?: string
    comment?: string
    photos?: string[]
  }): Promise<Review> => {
    const response = await apiRequest<Review>('/api/services/reviews', {
      method: 'POST',
      body: JSON.stringify({ bookingId, ...reviewData }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add review')
    }
    return response.data
  },

  // Get reviews for a service/provider
  getReviews: async (serviceId?: string, providerId?: string): Promise<Review[]> => {
    const queryParams = new URLSearchParams()
    if (serviceId) queryParams.append('serviceId', serviceId)
    if (providerId) queryParams.append('providerId', providerId)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<Review[]>(`/api/services/reviews${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  }
}

// Emergency API functions
export const emergencyApi = {
  // Find nearby vets
  findVets: async (location: { lat: number; lng: number }): Promise<ApiResponse<any[]>> => {
    return apiRequest('/api/emergency/vets', {
      method: 'POST',
      body: JSON.stringify({ location }),
    })
  },

  // Get emergency guidance
  getGuidance: async (symptoms: string[]): Promise<ApiResponse<any>> => {
    return apiRequest('/api/emergency/guidance', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    })
  },

  // Emergency booking
  emergencyBooking: async (bookingData: any): Promise<ApiResponse<any>> => {
    return apiRequest('/api/emergency/booking', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    })
  }
}

// Social API functions
export const social = {
  // Get social feed
  getFeed: async (filters?: { type?: string; location?: string }): Promise<SocialPost[]> => {
    const queryParams = new URLSearchParams()
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.location) queryParams.append('location', filters.location)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<{ posts: SocialPost[] }>(`/api/social/feed${queryString ? `?${queryString}` : ''}`)
    return response.data?.posts || []
  },

  // Create new post
  createPost: async (postData: CreatePostRequest): Promise<SocialPost> => {
    const formData = new FormData()
    formData.append('content', postData.content)
    if (postData.petId) formData.append('petId', postData.petId)
    if (postData.type) formData.append('type', postData.type)
    if (postData.visibility) formData.append('visibility', postData.visibility)
    if (postData.location) formData.append('location', JSON.stringify(postData.location))
    if (postData.tags) formData.append('tags', JSON.stringify(postData.tags))
    
    // Add images
    if (postData.images) {
      postData.images.forEach((image, index) => {
        formData.append(`images`, image)
      })
    }

    const response = await apiRequest<SocialPost>('/api/social/posts', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create post')
    }
    return response.data
  },

  // Like/unlike post
  toggleLike: async (postId: string): Promise<{ liked: boolean; likeCount: number }> => {
    const response = await apiRequest<{ liked: boolean; likeCount: number }>(`/api/social/posts/${postId}/like`, {
      method: 'POST',
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to toggle like')
    }
    return response.data
  },

  // Add comment
  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<Comment> => {
    const response = await apiRequest<Comment>(`/api/social/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentCommentId }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add comment')
    }
    return response.data
  },

  // Get nearby pet owners
  getNearbyOwners: async (radius: number = 5): Promise<User[]> => {
    const response = await apiRequest<{ nearbyOwners: User[] }>(`/api/social/nearby?radius=${radius}`)
    return response.data?.nearbyOwners || []
  },

  // Get community groups
  getGroups: async (filters?: { type?: string; location?: string }): Promise<CommunityGroup[]> => {
    const queryParams = new URLSearchParams()
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.location) queryParams.append('location', filters.location)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<CommunityGroup[]>(`/api/social/groups${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Join group
  joinGroup: async (groupId: string): Promise<void> => {
    const response = await apiRequest(`/api/social/groups/${groupId}/join`, {
      method: 'POST',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to join group')
    }
  },

  // Get playdates
  getPlaydates: async (filters?: { location?: string; date?: string; species?: string }): Promise<Playdate[]> => {
    const queryParams = new URLSearchParams()
    if (filters?.location) queryParams.append('location', filters.location)
    if (filters?.date) queryParams.append('date', filters.date)
    if (filters?.species) queryParams.append('species', filters.species)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<Playdate[]>(`/api/social/playdates${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Create playdate
  createPlaydate: async (playdateData: CreatePlaydateRequest): Promise<Playdate> => {
    const response = await apiRequest<Playdate>('/api/social/playdates', {
      method: 'POST',
      body: JSON.stringify(playdateData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create playdate')
    }
    return response.data
  },

  // Join playdate
  joinPlaydate: async (playdateId: string, petIds: string[], status: 'attending' | 'maybe' = 'attending'): Promise<void> => {
    const response = await apiRequest(`/api/social/playdates/${playdateId}/join`, {
      method: 'POST',
      body: JSON.stringify({ petIds, status }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to join playdate')
    }
  },

  // Get social connections
  getConnections: async (type: 'friends' | 'followers' | 'following' = 'friends'): Promise<SocialConnection[]> => {
    const response = await apiRequest<SocialConnection[]>(`/api/social/connections?type=${type}`)
    return response.data || []
  },

  // Send friend request
  sendFriendRequest: async (userId: string): Promise<void> => {
    const response = await apiRequest('/api/social/connections/request', {
      method: 'POST',
      body: JSON.stringify({ userId, connectionType: 'friend' }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to send friend request')
    }
  },

  // Accept friend request
  acceptFriendRequest: async (connectionId: string): Promise<void> => {
    const response = await apiRequest(`/api/social/connections/${connectionId}/accept`, {
      method: 'POST',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to accept friend request')
    }
  },

  // Get notifications
  getNotifications: async (): Promise<SocialNotification[]> => {
    const response = await apiRequest<SocialNotification[]>('/api/social/notifications')
    return response.data || []
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string): Promise<void> => {
    const response = await apiRequest(`/api/social/notifications/${notificationId}/read`, {
      method: 'POST',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to mark notification as read')
    }
  }
}

// E-commerce API functions
export const ecommerce = {
  // Get all products with filtering
  getProducts: async (filters?: {
    category?: string
    subcategory?: string
    petType?: string
    priceMin?: number
    priceMax?: number
    search?: string
    inStock?: boolean
    page?: number
    limit?: number
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> => {
    const queryParams = new URLSearchParams()
    if (filters?.category) queryParams.append('category', filters.category)
    if (filters?.subcategory) queryParams.append('subcategory', filters.subcategory)
    if (filters?.petType) queryParams.append('petType', filters.petType)
    if (filters?.priceMin) queryParams.append('priceMin', filters.priceMin.toString())
    if (filters?.priceMax) queryParams.append('priceMax', filters.priceMax.toString())
    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString())
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    
    const queryString = queryParams.toString()
    const response = await apiRequest<{ products: Product[]; total: number; page: number; totalPages: number }>(
      `/api/ecommerce/products${queryString ? `?${queryString}` : ''}`
    )
    return response.data || { products: [], total: 0, page: 1, totalPages: 0 }
  },

  // Get single product
  getProduct: async (productId: string): Promise<Product | null> => {
    const response = await apiRequest<Product>(`/api/ecommerce/products/${productId}`)
    return response.data || null
  },

  // Get featured products
  getFeaturedProducts: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiRequest<Product[]>(`/api/ecommerce/products/featured?limit=${limit}`)
    return response.data || []
  },

  // Get product categories
  getCategories: async (): Promise<{ name: string; count: number; subcategories?: { name: string; count: number }[] }[]> => {
    const response = await apiRequest<{ name: string; count: number; subcategories?: { name: string; count: number }[] }[]>(
      '/api/ecommerce/categories'
    )
    return response.data || []
  },

  // Get shopping cart
  getCart: async (): Promise<ShoppingCart | null> => {
    const response = await apiRequest<ShoppingCart>('/api/ecommerce/cart')
    return response.data || null
  },

  // Add item to cart
  addToCart: async (item: AddToCartRequest): Promise<ShoppingCart> => {
    const response = await apiRequest<ShoppingCart>('/api/ecommerce/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add item to cart')
    }
    return response.data
  },

  // Update cart item
  updateCartItem: async (itemId: string, updates: UpdateCartItemRequest): Promise<ShoppingCart> => {
    const response = await apiRequest<ShoppingCart>(`/api/ecommerce/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update cart item')
    }
    return response.data
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<ShoppingCart> => {
    const response = await apiRequest<ShoppingCart>(`/api/ecommerce/cart/items/${itemId}`, {
      method: 'DELETE',
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to remove item from cart')
    }
    return response.data
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    const response = await apiRequest('/api/ecommerce/cart/clear', {
      method: 'DELETE',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to clear cart')
    }
  },

  // Apply coupon
  applyCoupon: async (couponCode: string): Promise<ShoppingCart> => {
    const response = await apiRequest<ShoppingCart>('/api/ecommerce/cart/coupon', {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to apply coupon')
    }
    return response.data
  },

  // Create order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await apiRequest<Order>('/api/ecommerce/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create order')
    }
    return response.data
  },

  // Get user orders
  getOrders: async (status?: Order['status']): Promise<Order[]> => {
    const queryString = status ? `?status=${status}` : ''
    const response = await apiRequest<Order[]>(`/api/ecommerce/orders${queryString}`)
    return response.data || []
  },

  // Get single order
  getOrder: async (orderId: string): Promise<Order | null> => {
    const response = await apiRequest<Order>(`/api/ecommerce/orders/${orderId}`)
    return response.data || null
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string): Promise<Order> => {
    const response = await apiRequest<Order>(`/api/ecommerce/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to cancel order')
    }
    return response.data
  },

  // Get wishlists
  getWishlists: async (): Promise<Wishlist[]> => {
    const response = await apiRequest<Wishlist[]>('/api/ecommerce/wishlists')
    return response.data || []
  },

  // Create wishlist
  createWishlist: async (name: string, description?: string, isPublic?: boolean): Promise<Wishlist> => {
    const response = await apiRequest<Wishlist>('/api/ecommerce/wishlists', {
      method: 'POST',
      body: JSON.stringify({ name, description, isPublic }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create wishlist')
    }
    return response.data
  },

  // Add to wishlist
  addToWishlist: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await apiRequest<Wishlist>(`/api/ecommerce/wishlists/${wishlistId}/products`, {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add to wishlist')
    }
    return response.data
  },

  // Remove from wishlist
  removeFromWishlist: async (wishlistId: string, productId: string): Promise<Wishlist> => {
    const response = await apiRequest<Wishlist>(`/api/ecommerce/wishlists/${wishlistId}/products/${productId}`, {
      method: 'DELETE',
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to remove from wishlist')
    }
    return response.data
  },

  // Create product review
  createReview: async (reviewData: CreateReviewRequest): Promise<ProductReview> => {
    const formData = new FormData()
    formData.append('productId', reviewData.productId)
    formData.append('rating', reviewData.rating.toString())
    if (reviewData.title) formData.append('title', reviewData.title)
    formData.append('content', reviewData.content)
    
    // Add images
    if (reviewData.images) {
      reviewData.images.forEach((image) => {
        formData.append('images', image)
      })
    }

    const response = await apiRequest<ProductReview>('/api/ecommerce/reviews', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create review')
    }
    return response.data
  },

  // Get product reviews
  getProductReviews: async (productId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: ProductReview[]
    total: number
    averageRating: number
    ratingBreakdown: { [key: number]: number }
  }> => {
    const response = await apiRequest<{
      reviews: ProductReview[]
      total: number
      averageRating: number
      ratingBreakdown: { [key: number]: number }
    }>(`/api/ecommerce/products/${productId}/reviews?page=${page}&limit=${limit}`)
    return response.data || { reviews: [], total: 0, averageRating: 0, ratingBreakdown: {} }
  }
}

// Adoption API functions
export const adoption = {
  // Get adoption listings with filtering
  getListings: async (filters?: AdoptionFilters): Promise<{
    listings: AdoptionListing[]
    total: number
    page: number
    totalPages: number
  }> => {
    const queryParams = new URLSearchParams()
    if (filters?.species) queryParams.append('species', filters.species)
    if (filters?.breed) queryParams.append('breed', filters.breed)
    if (filters?.ageMin !== undefined) queryParams.append('ageMin', filters.ageMin.toString())
    if (filters?.ageMax !== undefined) queryParams.append('ageMax', filters.ageMax.toString())
    if (filters?.size) queryParams.append('size', filters.size)
    if (filters?.gender) queryParams.append('gender', filters.gender)
    if (filters?.goodWithChildren !== undefined) queryParams.append('goodWithChildren', filters.goodWithChildren.toString())
    if (filters?.goodWithCats !== undefined) queryParams.append('goodWithCats', filters.goodWithCats.toString())
    if (filters?.goodWithDogs !== undefined) queryParams.append('goodWithDogs', filters.goodWithDogs.toString())
    if (filters?.location) queryParams.append('location', filters.location)
    if (filters?.maxDistance !== undefined) queryParams.append('maxDistance', filters.maxDistance.toString())
    if (filters?.adoptionFeeMax !== undefined) queryParams.append('adoptionFeeMax', filters.adoptionFeeMax.toString())
    if (filters?.urgency) queryParams.append('urgency', filters.urgency)
    if (filters?.specialNeeds !== undefined) queryParams.append('specialNeeds', filters.specialNeeds.toString())
    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    
    const queryString = queryParams.toString()
    const response = await apiRequest<{
      listings: AdoptionListing[]
      total: number
      page: number
      totalPages: number
    }>(`/api/adoption/listings${queryString ? `?${queryString}` : ''}`)
    return response.data || { listings: [], total: 0, page: 1, totalPages: 0 }
  },

  // Get single adoption listing
  getListing: async (listingId: string): Promise<AdoptionListing | null> => {
    const response = await apiRequest<AdoptionListing>(`/api/adoption/listings/${listingId}`)
    return response.data || null
  },

  // Get featured adoption listings
  getFeaturedListings: async (limit: number = 6): Promise<AdoptionListing[]> => {
    const response = await apiRequest<AdoptionListing[]>(`/api/adoption/listings/featured?limit=${limit}`)
    return response.data || []
  },

  // Get urgent adoption listings
  getUrgentListings: async (limit: number = 10): Promise<AdoptionListing[]> => {
    const response = await apiRequest<AdoptionListing[]>(`/api/adoption/listings/urgent?limit=${limit}`)
    return response.data || []
  },

  // Submit adoption application
  submitApplication: async (applicationData: AdoptionApplicationRequest): Promise<AdoptionApplication> => {
    const response = await apiRequest<AdoptionApplication>('/api/adoption/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to submit application')
    }
    return response.data
  },

  // Get user's adoption applications
  getMyApplications: async (status?: AdoptionApplication['status']): Promise<AdoptionApplication[]> => {
    const queryString = status ? `?status=${status}` : ''
    const response = await apiRequest<AdoptionApplication[]>(`/api/adoption/applications/my${queryString}`)
    return response.data || []
  },

  // Get single adoption application
  getApplication: async (applicationId: string): Promise<AdoptionApplication | null> => {
    const response = await apiRequest<AdoptionApplication>(`/api/adoption/applications/${applicationId}`)
    return response.data || null
  },

  // Update adoption application
  updateApplication: async (applicationId: string, updates: Partial<AdoptionApplicationRequest>): Promise<AdoptionApplication> => {
    const response = await apiRequest<AdoptionApplication>(`/api/adoption/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update application')
    }
    return response.data
  },

  // Withdraw adoption application
  withdrawApplication: async (applicationId: string, reason?: string): Promise<void> => {
    const response = await apiRequest(`/api/adoption/applications/${applicationId}/withdraw`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to withdraw application')
    }
  },

  // Add pet to favorites
  addToFavorites: async (petId: string, notes?: string): Promise<AdoptionFavorite> => {
    const response = await apiRequest<AdoptionFavorite>('/api/adoption/favorites', {
      method: 'POST',
      body: JSON.stringify({ petId, notes }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add to favorites')
    }
    return response.data
  },

  // Remove pet from favorites
  removeFromFavorites: async (favoriteId: string): Promise<void> => {
    const response = await apiRequest(`/api/adoption/favorites/${favoriteId}`, {
      method: 'DELETE',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to remove from favorites')
    }
  },

  // Get user's favorite pets
  getFavorites: async (): Promise<AdoptionFavorite[]> => {
    const response = await apiRequest<AdoptionFavorite[]>('/api/adoption/favorites')
    return response.data || []
  },

  // Get adoption statistics
  getStats: async (): Promise<{
    totalPets: number
    availablePets: number
    urgentPets: number
    successfulAdoptions: number
    shelterCount: number
  }> => {
    const response = await apiRequest<{
      totalPets: number
      availablePets: number
      urgentPets: number
      successfulAdoptions: number
      shelterCount: number
    }>('/api/adoption/stats')
    return response.data || {
      totalPets: 0,
      availablePets: 0,
      urgentPets: 0,
      successfulAdoptions: 0,
      shelterCount: 0
    }
  },

  // Search shelters
  searchShelters: async (query?: string, location?: string): Promise<AdoptionListing['shelter'][]> => {
    const queryParams = new URLSearchParams()
    if (query) queryParams.append('q', query)
    if (location) queryParams.append('location', location)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<AdoptionListing['shelter'][]>(`/api/adoption/shelters${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Report listing issue
  reportListing: async (listingId: string, reason: string, details: string): Promise<void> => {
    const response = await apiRequest('/api/adoption/report', {
      method: 'POST',
      body: JSON.stringify({ listingId, reason, details }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to report listing')
    }
  }
}

// Emergency API
export const emergency = {
  // Get emergency services with location-based filtering
  getServices: async (filters?: EmergencyFilters): Promise<{
    services: EmergencyService[]
    total: number
    nearestService?: EmergencyService
  }> => {
    const queryParams = new URLSearchParams()
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.isAvailable24h !== undefined) queryParams.append('isAvailable24h', filters.isAvailable24h.toString())
    if (filters?.currentStatus) queryParams.append('currentStatus', filters.currentStatus)
    if (filters?.services) queryParams.append('services', filters.services.join(','))
    if (filters?.maxDistance) queryParams.append('maxDistance', filters.maxDistance.toString())
    if (filters?.acceptsInsurance !== undefined) queryParams.append('acceptsInsurance', filters.acceptsInsurance.toString())
    if (filters?.minRating) queryParams.append('minRating', filters.minRating.toString())
    if (filters?.location) {
      queryParams.append('lat', filters.location.coordinates[1].toString())
      queryParams.append('lng', filters.location.coordinates[0].toString())
      queryParams.append('radius', filters.location.radius.toString())
    }
    
    const queryString = queryParams.toString()
    const response = await apiRequest<{
      services: EmergencyService[]
      total: number
      nearestService?: EmergencyService
    }>(`/api/emergency/services${queryString ? `?${queryString}` : ''}`)
    return response.data || { services: [], total: 0 }
  },

  // Get single emergency service
  getService: async (serviceId: string): Promise<EmergencyService | null> => {
    const response = await apiRequest<EmergencyService>(`/api/emergency/services/${serviceId}`)
    return response.data || null
  },

  // Get nearby services using geolocation
  getNearbyServices: async (coordinates: [number, number], radius: number = 25): Promise<EmergencyService[]> => {
    const response = await apiRequest<EmergencyService[]>(
      `/api/emergency/services/nearby?lat=${coordinates[1]}&lng=${coordinates[0]}&radius=${radius}`
    )
    return response.data || []
  },

  // Create emergency request
  createRequest: async (requestData: CreateEmergencyRequest): Promise<EmergencyRequest> => {
    const formData = new FormData()
    formData.append('requestData', JSON.stringify({
      petId: requestData.petId,
      emergency: {
        type: requestData.emergency.type,
        severity: requestData.emergency.severity,
        description: requestData.emergency.description,
        symptoms: requestData.emergency.symptoms,
        duration: requestData.emergency.duration,
        vitals: requestData.emergency.vitals
      },
      location: requestData.location,
      requestedServices: requestData.requestedServices,
      preferredServiceType: requestData.preferredServiceType,
      notes: requestData.notes
    }))
    
    // Add photos if provided
    if (requestData.emergency.photos) {
      requestData.emergency.photos.forEach((photo) => {
        formData.append(`photos`, photo)
      })
    }

    const response = await apiRequest<EmergencyRequest>('/api/emergency/requests', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create emergency request')
    }
    return response.data
  },

  // Get user's emergency requests
  getMyRequests: async (status?: EmergencyRequest['status']): Promise<EmergencyRequest[]> => {
    const queryString = status ? `?status=${status}` : ''
    const response = await apiRequest<EmergencyRequest[]>(`/api/emergency/requests/my${queryString}`)
    return response.data || []
  },

  // Get single emergency request
  getRequest: async (requestId: string): Promise<EmergencyRequest | null> => {
    const response = await apiRequest<EmergencyRequest>(`/api/emergency/requests/${requestId}`)
    return response.data || null
  },

  // Update emergency request status
  updateRequestStatus: async (requestId: string, status: EmergencyRequest['status'], notes?: string): Promise<EmergencyRequest> => {
    const response = await apiRequest<EmergencyRequest>(`/api/emergency/requests/${requestId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update request status')
    }
    return response.data
  },

  // Cancel emergency request
  cancelRequest: async (requestId: string, reason?: string): Promise<void> => {
    const response = await apiRequest(`/api/emergency/requests/${requestId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel emergency request')
    }
  },

  // Get emergency contacts
  getContacts: async (): Promise<EmergencyContact[]> => {
    const response = await apiRequest<EmergencyContact[]>('/api/emergency/contacts')
    return response.data || []
  },

  // Add emergency contact
  addContact: async (contactData: Omit<EmergencyContact, '_id' | 'userId' | 'createdAt'>): Promise<EmergencyContact> => {
    const response = await apiRequest<EmergencyContact>('/api/emergency/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add emergency contact')
    }
    return response.data
  },

  // Search poison information
  searchPoisonInfo: async (query: string, species?: string): Promise<PoisonInfo[]> => {
    const queryParams = new URLSearchParams({ q: query })
    if (species) queryParams.append('species', species)
    
    const response = await apiRequest<PoisonInfo[]>(`/api/emergency/poison-info?${queryParams.toString()}`)
    return response.data || []
  },

  // Get first aid guides
  getFirstAidGuides: async (category?: FirstAidGuide['category'], species?: string): Promise<FirstAidGuide[]> => {
    const queryParams = new URLSearchParams()
    if (category) queryParams.append('category', category)
    if (species) queryParams.append('species', species)
    
    const queryString = queryParams.toString()
    const response = await apiRequest<FirstAidGuide[]>(`/api/emergency/first-aid${queryString ? `?${queryString}` : ''}`)
    return response.data || []
  },

  // Get single first aid guide
  getFirstAidGuide: async (guideId: string): Promise<FirstAidGuide | null> => {
    const response = await apiRequest<FirstAidGuide>(`/api/emergency/first-aid/${guideId}`)
    return response.data || null
  },

  // Get current user location (browser geolocation)
  getCurrentLocation: (): Promise<{ coordinates: [number, number]; accuracy: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  },

  // Calculate distance between two points
  calculateDistance: (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (coord2[1] - coord1[1]) * Math.PI / 180
    const dLon = (coord2[0] - coord1[0]) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
}

// Health tracking API functions
export const health = {
  // Get health records for a pet
  getHealthRecords: async (petId?: string): Promise<HealthRecord[]> => {
    const queryString = petId ? `?petId=${petId}` : ''
    const response = await apiRequest<HealthRecord[]>(`/api/health/records${queryString}`)
    return response.data || []
  },

  // Add new health record
  addHealthRecord: async (recordData: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthRecord> => {
    const formData = new FormData()
    Object.entries(recordData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append('attachments', file)
          })
        } else {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString())
        }
      }
    })

    const response = await apiRequest<HealthRecord>('/api/health/records', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add health record')
    }
    return response.data
  },

  // Update health record
  updateHealthRecord: async (recordId: string, updates: Partial<HealthRecord>): Promise<HealthRecord> => {
    const response = await apiRequest<HealthRecord>(`/api/health/records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update health record')
    }
    return response.data
  },

  // Delete health record
  deleteHealthRecord: async (recordId: string): Promise<void> => {
    const response = await apiRequest(`/api/health/records/${recordId}`, {
      method: 'DELETE',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete health record')
    }
  },

  // Get vaccination records for a pet
  getVaccinationRecords: async (petId?: string): Promise<VaccinationRecord[]> => {
    const queryString = petId ? `?petId=${petId}` : ''
    const response = await apiRequest<VaccinationRecord[]>(`/api/health/vaccinations${queryString}`)
    return response.data || []
  },

  // Get upcoming vaccinations
  getUpcomingVaccinations: async (petId?: string): Promise<VaccinationRecord[]> => {
    const queryString = petId ? `?petId=${petId}` : ''
    const response = await apiRequest<VaccinationRecord[]>(`/api/health/vaccinations/upcoming${queryString}`)
    return response.data || []
  },

  // Add vaccination record
  addVaccinationRecord: async (vaccinationData: Omit<VaccinationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<VaccinationRecord> => {
    const response = await apiRequest<VaccinationRecord>('/api/health/vaccinations', {
      method: 'POST',
      body: JSON.stringify(vaccinationData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add vaccination record')
    }
    return response.data
  },

  // Update vaccination record
  updateVaccinationRecord: async (recordId: string, updates: Partial<VaccinationRecord>): Promise<VaccinationRecord> => {
    const response = await apiRequest<VaccinationRecord>(`/api/health/vaccinations/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update vaccination record')
    }
    return response.data
  },

  // Get health reminders
  getReminders: async (petId?: string): Promise<HealthReminder[]> => {
    const queryString = petId ? `?petId=${petId}` : ''
    const response = await apiRequest<HealthReminder[]>(`/api/health/reminders${queryString}`)
    return response.data || []
  },

  // Get upcoming health reminders
  getUpcomingReminders: async (days: number = 30): Promise<HealthReminder[]> => {
    const response = await apiRequest<HealthReminder[]>(`/api/health/reminders/upcoming?days=${days}`)
    return response.data || []
  },

  // Add health reminder
  addReminder: async (reminderData: Omit<HealthReminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthReminder> => {
    const response = await apiRequest<HealthReminder>('/api/health/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add health reminder')
    }
    return response.data
  },

  // Update reminder
  updateReminder: async (reminderId: string, updates: Partial<HealthReminder>): Promise<HealthReminder> => {
    const response = await apiRequest<HealthReminder>(`/api/health/reminders/${reminderId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update reminder')
    }
    return response.data
  },

  // Delete reminder
  deleteReminder: async (reminderId: string): Promise<void> => {
    const response = await apiRequest(`/api/health/reminders/${reminderId}`, {
      method: 'DELETE',
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete reminder')
    }
  },

  // Mark reminder as completed
  completeReminder: async (reminderId: string): Promise<HealthReminder> => {
    const response = await apiRequest<HealthReminder>(`/api/health/reminders/${reminderId}/complete`, {
      method: 'POST',
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to complete reminder')
    }
    return response.data
  },

  // Get health statistics for a pet
  getHealthStats: async (petId: string, period?: 'week' | 'month' | 'year'): Promise<HealthStats> => {
    const queryString = period ? `?period=${period}` : ''
    const response = await apiRequest<HealthStats>(`/api/health/stats/${petId}${queryString}`)
    return response.data || {
      totalRecords: 0,
      recentCheckups: 0,
      vaccinationsUpToDate: 0,
      upcomingReminders: 0,
      healthScore: 0
    }
  },

  // Get weight tracking data
  getWeightHistory: async (petId: string): Promise<WeightRecord[]> => {
    const response = await apiRequest<WeightRecord[]>(`/api/health/weight/${petId}`)
    return response.data || []
  },

  // Add weight record
  addWeightRecord: async (petId: string, weight: number, date: Date, notes?: string): Promise<WeightRecord> => {
    const response = await apiRequest<WeightRecord>('/api/health/weight', {
      method: 'POST',
      body: JSON.stringify({ petId, weight, date: date.toISOString(), notes }),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add weight record')
    }
    return response.data
  },

  // Get nearby veterinarians
  getNearbyVets: async (coordinates?: [number, number], radius: number = 25): Promise<VeterinarianListing[]> => {
    const queryParams = new URLSearchParams()
    if (coordinates) {
      queryParams.append('lat', coordinates[1].toString())
      queryParams.append('lng', coordinates[0].toString())
    }
    queryParams.append('radius', radius.toString())
    
    const response = await apiRequest<VeterinarianListing[]>(`/api/health/vets?${queryParams.toString()}`)
    return response.data || []
  },

  // Book vet appointment
  bookVetAppointment: async (appointmentData: VetAppointmentRequest): Promise<VetAppointment> => {
    const response = await apiRequest<VetAppointment>('/api/health/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    })
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to book appointment')
    }
    return response.data
  },

  // Get user's vet appointments
  getMyAppointments: async (status?: VetAppointment['status']): Promise<VetAppointment[]> => {
    const queryString = status ? `?status=${status}` : ''
    const response = await apiRequest<VetAppointment[]>(`/api/health/appointments/my${queryString}`)
    return response.data || []
  },

  // Cancel vet appointment
  cancelAppointment: async (appointmentId: string, reason?: string): Promise<void> => {
    const response = await apiRequest(`/api/health/appointments/${appointmentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel appointment')
    }
  },

  // Get health insights and recommendations
  getHealthInsights: async (petId: string): Promise<HealthInsight[]> => {
    const response = await apiRequest<HealthInsight[]>(`/api/health/insights/${petId}`)
    return response.data || []
  }
}

// Main API object
export const api = {
  auth: authApi,
  pets,
  services,
  social,
  ecommerce,
  adoption,
  emergency,
  health,
}

export default api