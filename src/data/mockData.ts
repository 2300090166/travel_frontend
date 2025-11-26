export interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
  capacity: number;
  features: string[] | string; // Can be array from mock data or string from backend
}

export interface Order {
  id: string;
  vehicleId: string;
  vehicleName: string;
  status: 'booked' | 'on-the-way' | 'arriving' | 'completed';
  estimatedArrival: string;
  bookingDate: string;
  amount: number;
  paymentMethod: string;
}

export interface Feedback {
  id: string;
  username: string;
  rating: number;
  review: string;
  date: string;
}

export const vehicles: Vehicle[] = [
  {
    id: 'v1',
    name: 'Luxury SUV',
    type: 'SUV',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&auto=format&fit=crop',
    description: 'Spacious luxury SUV perfect for family adventures with premium comfort and safety features.',
    available: true,
    capacity: 7,
    features: ['GPS Navigation', 'Climate Control', 'Leather Seats', 'Premium Sound']
  },
  {
    id: 'v2',
    name: 'Sports Convertible',
    type: 'Convertible',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    description: 'Experience the thrill with this sleek sports convertible, perfect for coastal drives.',
    available: true,
    capacity: 2,
    features: ['Turbo Engine', 'Sport Mode', 'Premium Audio', 'Retractable Roof']
  },
  {
    id: 'v3',
    name: 'Family Minivan',
    type: 'Minivan',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&auto=format&fit=crop',
    description: 'Comfortable minivan ideal for group travel with ample storage space.',
    available: true,
    capacity: 8,
    features: ['Extra Storage', 'Sliding Doors', 'Entertainment System', 'Safety Features']
  },
  {
    id: 'v4',
    name: 'Electric Sedan',
    type: 'Sedan',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop',
    description: 'Eco-friendly electric sedan with cutting-edge technology and smooth performance.',
    available: true,
    capacity: 5,
    features: ['Fast Charging', 'Autopilot', 'Zero Emissions', 'Premium Interior']
  },
  {
    id: 'v5',
    name: 'Off-Road 4x4',
    type: '4x4',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop',
    description: 'Rugged 4x4 built for adventure seekers exploring challenging terrains.',
    available: false,
    capacity: 5,
    features: ['4WD', 'Hill Assist', 'Roof Rack', 'All-Terrain Tires']
  },
  {
    id: 'v6',
    name: 'Compact City Car',
    type: 'Compact',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop',
    description: 'Perfect for city exploration with excellent fuel efficiency and easy parking.',
    available: true,
    capacity: 4,
    features: ['Fuel Efficient', 'Easy Parking', 'Bluetooth', 'USB Charging']
  }
];

// Initialize vehicles in localStorage if not already present
if (typeof window !== 'undefined' && !localStorage.getItem('travelease_vehicles')) {
  localStorage.setItem('travelease_vehicles', JSON.stringify(vehicles));
}

export const mockFeedbacks: Feedback[] = [
  // default feedbacks removed — start with an empty list
];
 
