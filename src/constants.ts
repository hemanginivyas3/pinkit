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
  { id: 'rs1', name: 'Oleve Bistro', type: 'Cafe', description: 'Price: High. Beautiful aesthetics, best cafe in Rohtak.', image: '', location: 'The Oleve Bistro' },
  { id: 'rs2', name: 'Bole To VadaPav', type: 'Chaat', description: 'Price: Low. Go-to place for vadapav.', image: '', location: 'Bole to vadapav , Rohtak' },
  { id: 'rs3', name: 'Dominos', type: 'Pizza', description: 'Price: Medium.', image: '', location: "Domino\'s Pizza | Arjun Nagar, Rohtak" },
  { id: 'rs4', name: 'Pizza Hut', type: 'Pizza', description: 'Price: Medium.', image: '', location: 'Pizza Hut | Civil Lines, Rohtak' },
  { id: 'rs5', name: 'Gulaab Sweets and Namkeen', type: 'Chaat', description: 'Price: Medium.', image: '', location: 'Gulab - Sweets & Restaurant' },
  { id: 'rs6', name: 'Pandit Chaat Bhandar', type: 'Chaat', description: 'Price: Low.', image: '', location: 'Pandit Chat Bhandar' },
  { id: 'rs7', name: 'Mannat Haveli', type: 'Dhabha', description: 'Price: High.', image: '', location: 'Mannat Haveli Rohtak' },
  { id: 'rs8', name: 'Dhabha 24', type: 'Dhabha', description: 'Price: Low.', image: '', location: 'Dhaba 24' },
  { id: 'rs9', name: 'Jannat', type: 'Dhabha', description: 'Price: Medium.', image: '', location: 'JANNAT RESTRO & BYOB' },
  { id: 'rs10', name: 'Paris Multicuisine', type: 'Multicuisine', description: 'Price: Medium. Cool aesthetics.', image: '', location: 'THE PARIS MULTICUISINE FINE DINE RESTAURANT' },
  { id: 'rs11', name: "Baker\'s Bite", type: 'Cafe', description: 'Price: Medium. Great desserts.', image: '', location: 'Bakers Bite Cafe' },
  { id: 'rs12', name: 'Belgian Waffle', type: 'Dessert', description: 'Price: Medium.', image: '', location: 'The Belgian Waffle Co.' },
  { id: 'rs13', name: 'McDonalds', type: 'Burger', description: 'Price: Low.', image: '', location: "McDonald\'s" },
  { id: 'rs14', name: 'Liberty Cinema', type: 'Theatre', description: 'Price: Medium. On the main road.', image: '', location: 'Liberty Theatre' },
  { id: 'rs15', name: "Gianis\' Icecream", type: 'Dessert', description: 'Price: Medium.', image: '', location: 'Giani ice cream' },
  { id: 'rs16', name: 'Sheik Chang Singh', type: 'Chinese', description: 'Price: Medium. Momos, rolls, etc.', image: '', location: 'Sheikh Chang Singh' },
  { id: 'rs17', name: 'Qaenat', type: 'Multicuisine', description: 'Price: High. Fine dining, aesthetics.', image: '', location: 'QAENAT MULTICUISINE ROOFTOP RESTAURANT' },
  { id: 'rs18', name: 'Pearl Petal', type: 'Multicuisine', description: 'Price: High. Fine dining, aesthetics.', image: '', location: 'THE PEARL PETAL' },
  { id: 'rs19', name: 'The Jump House', type: 'Games', description: 'Price: Medium. Close to college.', image: '', location: 'The Jump House Trampoline Park' },
  { id: 'rs20', name: 'Ball n Bounce', type: 'Games', description: 'Price: Medium. Arcade and trampoline park.', image: '', location: 'Ball n Bounce - Best Gaming Zone & Kids soft play in Rohtak. Full entertainment for Family.' },
  { id: 'rs21', name: 'Zudio', type: 'Dress', description: 'Price: Low.', image: '', location: 'Zudio - Delhi Road, Rohtak' },
  { id: 'rs22', name: 'Trends', type: 'Dress', description: 'Price: Medium.', image: '', location: 'TRENDS' },
  { id: 'rs23', name: 'Pantaloons', type: 'Dress', description: 'Price: Medium.', image: '', location: 'Pantaloons (D-Park, Model Town, Rohtak)' },
  { id: 'rs24', name: 'Mr. DIY', type: 'Essentials', description: 'Price: Low. One-stop shop for all buying needs.', image: '', location: 'MR DIY' },
  { id: 'rs25', name: 'Ludhiana Bakery', type: 'Dessert', description: 'Price: Medium.', image: '', location: 'Ludhiana Wala' },
  { id: 'rs26', name: 'Theobroma', type: 'Dessert', description: 'Price: Medium.', image: '', location: 'Theobroma Bakery and Cake Shop - Subhash Nagar, Rohtak' },
  { id: 'rs27', name: 'Pappu Bakery', type: 'Dessert', description: 'Price: Low.', image: '', location: 'Pappu Bakery' },
  { id: 'rs28', name: 'Janki Bakery', type: 'Cafe', description: 'Price: Medium. Crazy aesthetics.', image: '', location: 'Janki Bakery' },
  { id: 'rs29', name: 'Bikanerwala', type: 'Dhabha', description: 'Price: Medium.', image: '', location: 'Bikanervala Rohtak' },
];

export const REVIEWS: Review[] = [];
export const VENDORS: Vendor[] = [];
export const DRIVERS: Driver[] = [];
export const COMMUNITY_POSTS: CommunityPost[] = [];

export const QUOTES = [
  "10 km away. 1 tap closer.",
  "Community > Commission.",
  "Built by students. For students.",
  "Rohtak to Campus, simplified."
];
