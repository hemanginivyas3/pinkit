import { Vendor, Driver, CommunityPost, Review, RouteFare, EssentialService, RohtakSpot } from './types';

export const APP_VERSION = "1.2.0";

export const ROUTE_FARES: RouteFare[] = [];

export const ESSENTIAL_SERVICES: EssentialService[] = [
  { id: 'es1', name: 'Rohtak Civil Hospital', category: 'Hospital', phone: '+911262252525', address: 'Near Railway Station' },
  { id: 'es2', name: 'LifeCare Pharmacy', category: 'Pharmacy', phone: '+919876543210', address: 'Main Gate Market' },
  { id: 'es3', name: 'Style Studio Salon', category: 'Salon', phone: '+919876543211', address: 'City Center' },
  { id: 'es4', name: 'Quick Clean Laundry', category: 'Laundry', phone: '+919876543212', address: 'Hostel Block A' },
];

export const ROHTAK_SPOTS: RohtakSpot[] = [
  { id: 'rs1', name: 'The Game Zone', type: 'Arcade', description: 'Best arcade in Rohtak with VR and racing sims.', image: 'https://picsum.photos/seed/arcade/400/300', location: 'D-Park' },
  { id: 'rs2', name: 'Sky Jumper', type: 'Park', description: 'Massive trampoline park for weekend fun.', image: 'https://picsum.photos/seed/trampoline/400/300', location: 'Sector 14' },
  { id: 'rs3', name: 'Brew & Bites', type: 'Cafe', description: 'Cozy cafe with the best cold coffee in town.', image: 'https://picsum.photos/seed/cafe/400/300', location: 'Model Town' },
  { id: 'rs4', name: 'Strike Alley', type: 'Bowling', description: 'Modern bowling alley with 8 lanes.', image: 'https://picsum.photos/seed/bowling/400/300', location: 'City Mall' },
];

export const REVIEWS: Review[] = [];

export const VENDORS: Vendor[] = [
  {
    "id": "v1",
    "name": "Diwaan",
    "category": "Grocery",
    "phone": "+918607846246",
    "whatsapp": "+918607846246",
    "image": "https://via.placeholder.com/150"
  },
  {
    "id": "v2",
    "name": "Azad",
    "category": "Grocery",
    "phone": "+919315421193",
    "whatsapp": "+919315421193",
    "image": "https://via.placeholder.com/150"
  },
  {
    "id": "v3",
    "name": "Vikas",
    "category": "Grocery",
    "phone": "+918950978191",
    "whatsapp": "+918950978191",
    "image": "https://via.placeholder.com/150"
  },
  {
    "id": "v4",
    "name": "Dhabha 24",
    "category": "Dhaba",
    "phone": "+917206992551",
    "whatsapp": "+917206992551",
    "image": "https://via.placeholder.com/150"
  },
  {
    "id": "v5",
    "name": "Sahil",
    "category": "Dhaba",
    "phone": "+919050098205",
    "whatsapp": "+919050098205",
    "image": "https://via.placeholder.com/150"
  },
  {
    "id": "v6",
    "name": "Sharma Tailors",
    "category": "Tailor",
    "phone": "+919876543220",
    "whatsapp": "+919876543220",
    "image": "https://picsum.photos/seed/tailor/400/300"
  },
  {
    "id": "v7",
    "name": "City Flowers",
    "category": "Flowers",
    "phone": "+919876543221",
    "whatsapp": "+919876543221",
    "image": "https://picsum.photos/seed/flowers/400/300"
  },
  {
    "id": "v8",
    "name": "Laptop Fix Rohtak",
    "category": "Tech Repair",
    "phone": "+919876543222",
    "whatsapp": "+919876543222",
    "image": "https://picsum.photos/seed/repair/400/300"
  }
];

export const DRIVERS: Driver[] = [
  {
    "id": "d1",
    "name": "Manav",
    "type": "Cab",
    "phone": "+918295009528",
    "whatsapp": "+918295009528",
    "isVerified": true
  },
  {
    "id": "d2",
    "name": "Rupesh",
    "type": "Cab",
    "phone": "+918685018042",
    "whatsapp": "+918685018042",
    "isVerified": true
  },
  {
    "id": "d3",
    "name": "Rohit Sharma",
    "type": "Cab",
    "phone": "+918571914068",
    "whatsapp": "+918571914068",
    "isVerified": true
  },
  {
    "id": "d4",
    "name": "Harsh Arora",
    "type": "Cab",
    "phone": "+919896841624",
    "whatsapp": "+919896841624",
    "isVerified": false
  },
  {
    "id": "d5",
    "name": "Vikram",
    "type": "Cab",
    "phone": "+918307676461",
    "whatsapp": "+918307676461",
    "isVerified": true
  },
  {
    "id": "d6",
    "name": "Vicky",
    "type": "Cab",
    "phone": "+919813587969",
    "whatsapp": "+919813587969",
    "isVerified": false
  },
  {
    "id": "d7",
    "name": "Moni",
    "type": "Cab",
    "phone": "+918607090200",
    "whatsapp": "+918607090200",
    "isVerified": true
  },
  {
    "id": "d8",
    "name": "Sunil",
    "type": "Auto",
    "phone": "+918059758898",
    "whatsapp": "+918059758898",
    "isVerified": true
  },
  {
    "id": "d9",
    "name": "Vicky Sharma",
    "type": "Auto",
    "phone": "+919588189013",
    "whatsapp": "+919588189013",
    "isVerified": true
  },
  {
    "id": "d10",
    "name": "Shanvibudwar Shanu",
    "type": "Auto",
    "phone": "+917404343408",
    "whatsapp": "+917404343408",
    "isVerified": false
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [];

export const QUOTES = [
  "10 km away. 1 tap closer.",
  "Community > Commission.",
  "Built by students. For students.",
  "Rohtak to Campus, simplified."
];
