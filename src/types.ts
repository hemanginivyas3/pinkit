export type Category = 
  | 'Grocery' 
  | 'Dhaba' 
  | 'Restaurant'
  | 'Cafe'
  | 'Dessert'
  | 'Street Food'
  | 'Mess'
  | 'Auto' 
  | 'Cab' 
  | 'Bus'
  | 'Taxi'
  | 'Parcel' 
  | 'Pharmacy' 
  | 'Hospital' 
  | 'Salon' 
  | 'Laundry' 
  | 'Tailor' 
  | 'Flowers' 
  | 'Delivery' 
  | 'Tech Repair' 
  | 'Mobile'
  | 'Education'
  | 'Stationary'
  | 'Post'
  | 'Documents'
  | 'Other';

export type PriceTag = 'Fair Price' | 'Expensive' | 'Premium';

export interface MenuItem {
  name: string;
  price: string;
}

export interface Review {
  id: string;
  targetId: string; // vendorId or driverId
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: Category;
  deliveryTime?: string;
  deliveryFee?: string;
  phone: string;
  whatsapp: string;
  rating?: number;
  reviewCount?: number;
  image: string;
  priceTag?: PriceTag;
  menu?: MenuItem[];
  isVerified?: boolean;
}

export interface Driver {
  id: string;
  name: string;
  type: 'Auto' | 'Cab';
  priceRange?: string;
  phone: string;
  whatsapp: string;
  rating?: number;
  reviewCount?: number;
  vehicleNumber?: string;
  isVerified: boolean;
  priceTag?: PriceTag;
}

export interface EssentialService {
  id: string;
  name: string;
  category: Category;
  phone: string;
  address: string;
}

export interface RohtakSpot {
  id: string;
  name: string;
  type: 'Cafe' | 'Arcade' | 'Bowling' | 'Park' | 'Food';
  description: string;
  image: string;
  location: string;
}

export interface RouteFare {
  id: string;
  from: string;
  to: string;
  fare: string;
}

export interface CommunityPost {
  id: string;
  userName: string;
  request: string;
  time: string;
  type: 'Ride' | 'Order' | 'Help' | 'Review' | 'Suggestion';
  contact: string;
  destination?: string;
  departureTime?: string;
  interestedUsers?: string[]; // List of user names who are interested
}

export interface OrderLog {
  id: string;
  vendorName: string;
  date: string;
  status: string;
}
