// Auth Types
export interface DeliveryBoy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  availability: 'available' | 'busy' | 'offline';
  totalDeliveries: number;
  completedDeliveries: number;
  rating: number;
  averageDeliveryTime?: number;
  lastActive?: string;
}

export interface DeliveryBoyProfile extends DeliveryBoy {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  fullAddress?: string;
  joinDate?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  bankAccount?: string;
  bankName?: string;
  ifscCode?: string;
  accountHolder?: string;
  totalEarnings?: number;
  averageRating?: number;
  completionRate?: number;
  license: {
    number: string;
    expiryDate: string;
  };
  vehicle: {
    type: 'two-wheeler' | 'three-wheeler' | 'car';
    registrationNumber: string;
    model: string;
  };
  isApproved: boolean;
  isVerified: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  vehicleType: 'two-wheeler' | 'three-wheeler' | 'car';
  vehicleRegistration: string;
  vehicleModel: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: DeliveryBoy;
  token: string;
}

// Order Types
export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtTime: number;
  subtotal: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  landmark?: string;
  instructions?: string;
}

export interface ContactInfo {
  phone: string;
  alternatePhone?: string;
}

export interface Pricing {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
}

export interface PaymentInfo {
  method: 'cash-on-delivery' | 'online' | 'wallet';
  status: 'pending' | 'completed' | 'failed';
}

export interface DeliveryInfo {
  assignedTo: string | DeliveryBoy;
  estimatedTime?: string;
  actualDeliveryTime?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  contactInfo: ContactInfo;
  pricing: Pricing;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentInfo: PaymentInfo;
  delivery?: DeliveryInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order | Order[];
}

// Stats Types
export interface DeliveryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  rating: number;
  averageDeliveryTime: number;
  availability: 'available' | 'busy' | 'offline';
  status: 'active' | 'inactive';
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: DeliveryStats;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationRequest {
  latitude: number;
  longitude: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
