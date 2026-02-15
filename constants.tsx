
import { RoomType, Room, CMSContent, AddOn } from './types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'room-1',
    name: 'Beachfront Deluxe',
    type: RoomType.DELUXE,
    maxOccupancy: 2,
    description: 'Wake up to the sound of waves in our spacious beachfront deluxe room.',
    amenities: ['Air Conditioning', 'En-suite Bathroom', 'Free Wi-Fi', 'Coffee Maker', 'Private Balcony'],
    images: ['https://picsum.photos/800/600?random=1'],
    baseRate: 150,
    totalRooms: 5
  },
  {
    id: 'room-2',
    name: 'Ocean View Suite',
    type: RoomType.OCEAN_VIEW,
    maxOccupancy: 3,
    description: 'Panoramic views of the turquoise Indian Ocean from your private sanctuary.',
    amenities: ['King Size Bed', 'Mini Bar', 'Luxury Toiletries', 'Flat Screen TV', 'Day Bed'],
    images: ['https://picsum.photos/800/600?random=2'],
    baseRate: 220,
    totalRooms: 3
  },
  {
    id: 'room-3',
    name: 'Garden Villa',
    type: RoomType.GARDEN_VILLA,
    maxOccupancy: 2,
    description: 'Tucked away in lush tropical gardens for ultimate privacy.',
    amenities: ['Private Garden Path', 'Outdoor Shower', 'Queen Bed', 'Nespresso Machine'],
    images: ['https://picsum.photos/800/600?random=3'],
    baseRate: 130,
    totalRooms: 4
  }
];

export const INITIAL_CMS: CMSContent = {
  heroTitle: 'Experience Tropical Paradise at Ruka Maldives',
  heroSubtitle: 'Escape to Dhiffushi Island, where luxury meets local charm.',
  heroImage: 'https://picsum.photos/1920/1080?random=10',
  aboutText: 'Ruka Maldives is a boutique guest house dedicated to providing an authentic Maldivian experience. Located on the beautiful island of Dhiffushi, we offer modern comforts, warm hospitality, and unforgettable ocean adventures.',
  contactEmail: 'hello@rukamaldives.com',
  contactPhone: '+960 123 4567',
  whatsapp: '+960 987 6543'
};

export const ADDONS: AddOn[] = [
  { id: 'add-1', name: 'Airport Speedboat Transfer', price: 35, type: 'per_person', frequency: 'once', description: 'Scheduled speedboat from Male Int Airport' },
  { id: 'add-2', name: 'Half Board Upgrade', price: 25, type: 'per_person', frequency: 'per_night', description: 'Breakfast and Dinner included' },
  { id: 'add-3', name: 'Sandbank Excursion', price: 60, type: 'per_person', frequency: 'once', description: 'Half day trip to a private sandbank' },
  { id: 'add-4', name: 'Snorkeling Gear Rental', price: 10, type: 'fixed', frequency: 'per_night', description: 'High quality mask, fins and snorkel' }
];

export const EXPERIENCES = [
  { title: 'Snorkeling Safari', description: 'Explore vibrant coral reefs and swim with sea turtles.', image: 'https://picsum.photos/600/400?random=20' },
  { title: 'Sandbank Picnic', description: 'A private lunch on a secluded patch of white sand.', image: 'https://picsum.photos/600/400?random=21' },
  { title: 'Dolphin Watching', description: 'Watch playful dolphins jump in the sunset glow.', image: 'https://picsum.photos/600/400?random=22' },
  { title: 'Island Hopping', description: 'Visit neighboring islands and learn about local life.', image: 'https://picsum.photos/600/400?random=23' }
];
