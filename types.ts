
export enum RoomType {
  DELUXE = 'Deluxe Room',
  OCEAN_VIEW = 'Ocean View Suite',
  GARDEN_VILLA = 'Garden Villa',
  FAMILY_SUITE = 'Family Suite'
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  maxOccupancy: number;
  description: string;
  amenities: string[];
  images: string[];
  baseRate: number;
  totalRooms: number;
}

export interface RateRule {
  date: string; // YYYY-MM-DD
  roomType: RoomType;
  baseRate: number;
  extraAdult: number;
  extraChild: number;
  minStay: number;
  stopSell: boolean;
  availableRooms: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  type: 'per_person' | 'fixed';
  frequency: 'once' | 'per_night';
  description: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  email: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  addOns: string[];
  createdAt: string;
}

export interface CMSContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
}
