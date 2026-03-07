import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  LayoutGrid, 
  Car, 
  Users, 
  User, 
  Search, 
  Phone, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Clock, 
  Truck, 
  AlertCircle,
  PlusCircle,
  MessageSquare,
  History,
  ShieldAlert,
  Award,
  CheckCircle2,
  MapPin,
  Stethoscope,
  Scissors,
  Waves,
  Info,
  ExternalLink,
  ShoppingBag,
  Send,
  Trash2,
  Edit,
  Shield
} from 'lucide-react';
import { Category, Vendor, Driver, CommunityPost, Review, RouteFare, EssentialService, RohtakSpot, PriceTag } from './types';
import { ROHTAK_SPOTS } from './constants';
import dataService from './services/dataService';

// Admin emails
const ADMIN_EMAILS = [
  'hemanginivyas3@gmail.com',
  '2nikhil.sharma131019@gmail.com',
  'ipm06bodap@iimrohtak.ac.in',
  'ipm06sangeethav@iimrohtak.ac.in'
];

// --- Components ---

const PriceTagBadge = ({ tag }: { tag?: PriceTag }) => {
  if (!tag) return null;
  const colors = {
    'Fair Price': 'bg-green-soft text-green-primary',
    'Expensive': 'bg-pink-soft text-pink-primary',
    'Premium': 'bg-blue-soft text-blue-primary'
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${colors[tag]}`}>
      {tag}
    </span>
  );
};

const VerifiedBadge = () => (
  <div className="flex items-center gap-1 bg-blue-soft text-blue-primary px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
    <CheckCircle2 size={10} />
    Verified
  </div>
);

const ReviewModal = ({ isOpen, onClose, targetName, onSubmit }: { isOpen: boolean, onClose: () => void, targetName: string, onSubmit: (rating: number, comment: string) => void }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8"
      >
        <h3 className="text-2xl font-black mb-2">Review {targetName}</h3>
        <p className="text-slate-500 mb-6">Share your experience with the community.</p>
        
        <div className="flex gap-2 mb-6 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)}>
              <Star 
                size={32} 
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} 
              />
            </button>
          ))}
        </div>

        <textarea 
          placeholder="What did you like or dislike?"
          className="w-full bg-slate-50 rounded-2xl p-4 text-sm mb-6 focus:outline-none border-2 border-transparent focus:border-pink-primary/20"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSubmit(rating, comment);
              onClose();
            }}
            className="flex-1 py-4 bg-pink-primary text-white font-bold rounded-2xl"
          >
            Post Review
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PostCommunityModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (type: 'Ride' | 'Order', details: any) => void }) => {
  const [type, setType] = useState<'Ride' | 'Order'>('Ride');
  const [dest, setDest] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8"
      >
        <div className="flex gap-2 mb-8 bg-pink-soft p-2 rounded-2xl">
          <button 
            onClick={() => setType('Ride')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${type === 'Ride' ? 'bg-pink-primary text-white shadow-lg' : 'text-pink-primary'}`}
          >
            🛵 Ride Pool
          </button>
          <button 
            onClick={() => setType('Order')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${type === 'Order' ? 'bg-teal-primary text-white shadow-lg' : 'text-teal-primary'}`}
          >
            🍕 Order Pool
          </button>
        </div>

        <h3 className="text-3xl font-black mb-2 italic tracking-tighter text-slate-900">
          {type === 'Ride' ? '🛵 Split a Ride?' : '🍕 Pool an Order?'}
        </h3>
        <p className="text-slate-500 mb-8 font-bold">
          {type === 'Ride' ? 'Find legends to split the fare with.' : 'Save on delivery fees with the community.'}
        </p>
        
        <div className="flex flex-col gap-6 mb-10">
          {type === 'Ride' ? (
            <>
              <div>
                <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Destination</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rohtak Junction"
                  className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 shadow-sm"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Departure Time</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4:30 PM"
                  className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 shadow-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[10px] font-black text-teal-primary uppercase mb-2 block ml-4 tracking-widest">Ordering From</label>
                <input 
                  type="text" 
                  placeholder="e.g. McDonald's"
                  className="w-full bg-teal-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-teal-primary/20 shadow-sm"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-teal-primary uppercase mb-2 block ml-4 tracking-widest">Ordering At</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8:00 PM"
                  className="w-full bg-teal-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-teal-primary/20 shadow-sm"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-[24px] uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSubmit(type, type === 'Ride' ? { dest, time } : { place, time });
              onClose();
            }}
            className={`flex-1 py-5 text-white font-black rounded-[24px] shadow-2xl uppercase tracking-widest text-xs ${type === 'Ride' ? 'bg-pink-primary shadow-pink-primary/30' : 'bg-teal-primary shadow-teal-primary/30'}`}
          >
            Post Request 📝
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const BottomNav = ({ activeTab, setActiveTab, onBackClick, isAdmin }: { activeTab: string, setActiveTab: (tab: string) => void, onBackClick?: () => void, isAdmin?: boolean }) => {
  const baseTabs = [
    { id: 'home', label: 'Home', icon: HomeIcon, emoji: '🏠' },
    { id: 'services', label: 'Services', icon: LayoutGrid, emoji: '🛒' },
    { id: 'community', label: 'Community', icon: Users, emoji: '👥' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  const adminTab = { id: 'admin', label: 'Admin', icon: Shield, emoji: '🛡️' };
  const tabs = isAdmin ? [...baseTabs.slice(0, -1), adminTab, baseTabs[baseTabs.length - 1]] : baseTabs;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/90 backdrop-blur-xl border-t border-pink-100 px-6 py-4 pb-8 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_30px_rgba(255,45,85,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id !== 'services') onBackClick?.();
            }}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
              isActive ? 'text-pink-primary' : 'text-slate-400'
            }`}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={isActive ? { y: -8, scale: 1.2 } : { y: 0, scale: 1 }}
              className="relative"
            >
              {isActive ? (
                <span className="text-2xl">{tab.emoji}</span>
              ) : (
                <tab.icon size={22} strokeWidth={2} />
              )}
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute -inset-2 bg-pink-primary/10 rounded-full blur-md -z-10"
                />
              )}
            </motion.div>
            <span className={`text-[8px] font-semibold uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = ({ title, showSearch = false, onSearch, onRefresh, isLoading, user }: { title: string, showSearch?: boolean, onSearch?: (query: string) => void, onRefresh?: () => void, isLoading?: boolean, user?: { name: string } }) => (
  <header className="sticky top-0 bg-gradient-to-r from-pink-soft via-pink-50 to-pink-soft/80 backdrop-blur-xl z-40 px-6 py-6 flex flex-col gap-6 border-b-2 border-pink-primary/20">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-primary/10 overflow-hidden border-2 border-pink-primary">
          <img 
            src="https://i.postimg.cc/YqVPH9m0/pinkit-logo.png" 
            alt="PinkIt Logo" 
            className="w-full h-full object-contain p-1"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-pink-primary">
            {title === 'PinkIt' ? '🎓 PinkIt' : title}
          </h1>
          <p className="text-[9px] font-semibold text-pink-primary/60 uppercase tracking-wide">Campus Legends Only</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className={`p-3 rounded-2xl bg-white text-slate-400 shadow-sm border border-pink-100 transition-all active:scale-90 ${isLoading ? 'animate-spin text-pink-primary' : ''}`}
            title="Refresh data"
          >
            <History size={20} />
          </button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-primary/20 flex items-center justify-center text-pink-primary font-semibold border-2 border-pink-100 shadow-sm uppercase text-sm tracking-tight">
          {user?.name?.substring(0, 2)?.toUpperCase() || 'JD'}
        </div>
      </div>
    </div>
    {showSearch && (
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-primary group-focus-within:text-pink-hot transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="🔍 Search services, contacts..." 
          className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm shadow-md border-2 border-pink-primary/20 focus:outline-none focus:border-pink-primary/50 transition-all placeholder:text-slate-400"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    )}
  </header>
);

const LoginScreen = ({ onLogin }: { onLogin: (name: string, email: string) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://i.postimg.cc/d1Yj855X/Whats-App-Image-2026-03-05-at-7-56-38-PM.jpg" 
          alt="Background" 
          className="w-full h-full object-cover blur-sm scale-110"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-pink-hot/20 to-slate-900" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-32 h-32 bg-white rounded-[40px] flex items-center justify-center mb-8 shadow-2xl shadow-pink-primary/40 animate-float overflow-hidden border-4 border-white"
      >
        <img 
          src="https://i.postimg.cc/YqVPH9m0/pinkit-logo.png" 
          alt="PinkIt Logo" 
          className="w-full h-full object-contain p-2"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 text-6xl font-bold text-white mb-2 drop-shadow-2xl">
        PinkIt
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-pink-soft mb-12 text-center font-semibold drop-shadow-lg"
      >
        Campus coordination, <span className="text-pink-primary font-bold">simplified.</span> 🎯
      </motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-6 mb-10"
      >
        <div className="relative">
          <label className="text-[9px] font-semibold text-pink-primary uppercase mb-2 block ml-4 tracking-wide">Your Name</label>
          <input 
            type="text" 
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-white/10 backdrop-blur-xl rounded-[24px] p-5 text-sm text-white placeholder:text-white/40 focus:outline-none border-2 border-white/10 focus:border-pink-primary/40 shadow-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative">
          <label className="text-[9px] font-semibold text-pink-primary uppercase mb-2 block ml-4 tracking-wide">Campus Email</label>
          <input 
            type="email" 
            placeholder="rahul@campus.edu"
            className="w-full bg-white/10 backdrop-blur-xl rounded-[24px] p-5 text-sm text-white placeholder:text-white/40 focus:outline-none border-2 border-white/10 focus:border-pink-primary/40 shadow-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => name && email && onLogin(name, email)}
        disabled={!name || !email}
        className="relative z-10 w-full max-w-sm py-5 bg-pink-primary text-white font-semibold rounded-[24px] shadow-2xl shadow-pink-primary/40 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-wide text-sm hover:brightness-110"
      >
        Let's Go! 🚀
      </motion.button>
    </div>
  );
};

const HomePage = ({ onCategoryClick, vendors, drivers }: { onCategoryClick: (cat: Category) => void, vendors: Vendor[], drivers: Driver[] }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quotes = [
    "10 km away. 1 tap closer. 🚀",
    "Community > Commission. 💪",
    "Built by students. For legends. 🎓",
    "Rohtak to Campus, simplified. 🎯",
    "Don't walk. PinkIt. 🛵",
    "Your campus, your rules. 🤝"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const categories: { name: Category | 'More', icon: string, color: string }[] = [
    { name: 'Grocery', icon: '🛒', color: 'bg-pink-soft text-pink-primary' },
    { name: 'Dhaba', icon: '🍛', color: 'bg-teal-soft text-teal-primary' },
    { name: 'Street Food', icon: '🌮', color: 'bg-pink-soft text-pink-primary' },
    { name: 'Auto', icon: '🛵', color: 'bg-teal-soft text-teal-primary' },
    { name: 'Cab', icon: '🚖', color: 'bg-pink-soft text-pink-primary' },
    { name: 'Parcel', icon: '📦', color: 'bg-teal-soft text-teal-primary' },
    { name: 'Pharmacy', icon: '💊', color: 'bg-pink-soft text-pink-primary' },
    { name: 'More', icon: '➕', color: 'bg-slate-100 text-slate-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 pb-24"
    >
      {/* Banner */}
      <div className="relative h-48 rounded-[40px] overflow-hidden mb-10 shadow-2xl shadow-pink-primary/20 group">
        <img 
          src="https://i.postimg.cc/d1Yj855X/Whats-App-Image-2026-03-05-at-7-56-38-PM.jpg" 
          alt="PinkIt Banner" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-white font-black text-2xl leading-tight max-w-[240px] italic tracking-tighter drop-shadow-lg">
                {quotes[quoteIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute right-8 bottom-8 text-4xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 drop-shadow-lg">
          ✨
        </div>
      </div>

      {/* Category Grid */}
      <h2 className="text-2xl font-bold mb-6 text-pink-primary">⚡ Quick Fixes</h2>
      <div className="grid grid-cols-4 gap-3 mb-10">
        {categories.map((cat) => (
          <motion.button 
            key={cat.name}
            onClick={() => cat.name === 'More' ? onCategoryClick(null as any) : onCategoryClick(cat.name as Category)}
            className="flex flex-col items-center gap-2 group transform hover:scale-105 transition-transform"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              whileHover={{ scale: 1.15, rotate: 8 }}
              whileTap={{ scale: 0.9 }}
              className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center shadow-lg text-4xl font-bold transform group-hover:shadow-xl group-hover:brightness-110 transition-all`}
            >
              {cat.icon}
            </motion.div>
            <span className="text-[9px] font-black text-slate-700 text-center uppercase tracking-tighter leading-tight">{cat.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Rohtak Spots Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-pink-primary">Popular Spots ✨</h2>
          <span className="text-[9px] font-semibold bg-pink-primary text-white px-2 py-1 rounded-full uppercase">Top Picks</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {ROHTAK_SPOTS.map((spot) => (
            <div key={spot.id} className="min-w-[260px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-pink-100 p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg leading-tight">{spot.name}</h3>
                <span className="text-[9px] font-semibold bg-teal-soft text-teal-primary px-2 py-1 rounded-lg uppercase">{spot.type}</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{spot.description}</p>
              <div className="flex items-center gap-2 text-[9px] font-semibold text-pink-primary bg-pink-soft w-fit px-3 py-1 rounded-full">
                <MapPin size={10} />
                {spot.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SuggestContactModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Grocery');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const categories: Category[] = [
    'Grocery', 'Dhaba', 'Street Food', 'Parcel', 'Pharmacy', 'Hospital', 'Salon', 'Laundry', 'Tailor', 'Flowers', 'Delivery', 'Tech Repair', 'Mobile'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-[70] flex items-end sm:items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 max-h-[90vh] overflow-y-auto no-scrollbar"
      >
        <h3 className="text-3xl font-black mb-2 italic tracking-tighter">💡 Suggest a Service</h3>
        <p className="text-slate-500 mb-8 font-bold">Help the community grow by adding a trusted contact.</p>
        
        <div className="flex flex-col gap-6 mb-10">
          <div>
            <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Service Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sharma Tailors"
              className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 shadow-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Category</label>
            <div className="relative">
              <select 
                className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 appearance-none shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-pink-primary pointer-events-none" size={20} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 XXXXX XXXXX"
              className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Any details? (Menu, Rates, etc.)</label>
            <textarea 
              placeholder="e.g. Best for alterations, charges ₹50"
              className="w-full bg-pink-soft/50 rounded-[24px] p-5 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 shadow-sm"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-[24px] uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onSubmit({ name, category, phone, description });
              onClose();
            }}
            className="flex-1 py-5 bg-pink-primary text-white font-black rounded-[24px] shadow-2xl shadow-pink-primary/30 uppercase tracking-widest text-xs"
          >
            Submit 🎯
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ServicesPage = ({ selectedCategory, onBack, onRefer, vendors, drivers, essentialServices, onReview, onCategorySelect, onPostRide }: { selectedCategory: Category | null, onBack: () => void, onRefer: () => void, vendors: Vendor[], drivers: Driver[], essentialServices: EssentialService[], onReview: (v: Vendor | Driver) => void, onCategorySelect: (cat: Category) => void, onPostRide: () => void }) => {
  const filteredVendors = selectedCategory 
    ? vendors.filter(v => v.category === selectedCategory)
    : vendors;

  const filteredDrivers = selectedCategory && ['Auto', 'Cab'].includes(selectedCategory)
    ? drivers.filter(d => d.type === selectedCategory)
    : [];

  const categories: Category[] = [
    'Grocery', 'Dhaba', 'Street Food', 'Auto', 'Cab', 'Parcel', 'Pharmacy', 'Hospital', 'Salon', 'Laundry', 'Tailor', 'Flowers', 'Delivery', 'Tech Repair', 'Mobile'
  ];

  const getEmoji = (cat: string) => {
    switch (cat) {
      case 'Grocery': return '🛒';
      case 'Dhaba': return '🍛';
      case 'Street Food': return '🌮';
      case 'Auto': return '🛵';
      case 'Cab': return '🚖';
      case 'Parcel': return '📦';
      case 'Pharmacy': return '💊';
      case 'Hospital': return '🏥';
      case 'Salon': return '✂️';
      case 'Laundry': return '🧺';
      case 'Tailor': return '👔';
      case 'Flowers': return '💐';
      case 'Delivery': return '🚚';
      case 'Tech Repair': return '🔧';
      case 'Mobile': return '📱';
      default: return '✨';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-6 pb-24"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <button onClick={onBack} className="p-3 bg-pink-soft text-pink-primary rounded-2xl active:scale-90 transition-all hover:bg-pink-primary/10" title="Go back">
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <h2 className="text-2xl font-bold text-pink-primary">
            {selectedCategory ? `${selectedCategory}` : '✨ All Services'}
          </h2>
        </div>
        <button 
          onClick={onRefer}
          className="p-3 bg-pink-primary text-white rounded-2xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wide shadow-lg shadow-pink-primary/20 active:scale-95 transition-all hover:brightness-110"
        >
          <PlusCircle size={18} />
          ➕ Suggest
        </button>
      </div>

      {!selectedCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategorySelect(cat)}
              className="bg-white p-6 rounded-[32px] border border-pink-100 shadow-sm flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-soft flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                {getEmoji(cat)}
              </div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">{cat}</span>
            </motion.button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {filteredVendors.length === 0 && filteredDrivers.length === 0 && selectedCategory && (
          <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
            <p className="text-slate-600 font-black text-lg mb-4">📭 No contacts found</p>
            <p className="text-slate-400 font-bold text-sm mb-6">No services in this category yet. Be the first to add one!</p>
            <button onClick={onRefer} className="text-pink-primary font-black uppercase text-xs tracking-widest underline hover:text-pink-hot">+ Add a contact</button>
          </div>
        )}
        {filteredVendors.length === 0 && !selectedCategory && (
          <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
            <p className="text-slate-600 font-black text-lg mb-4">🔍 No results</p>
            <p className="text-slate-400 font-bold text-sm">Try a different search or select a category above</p>
          </div>
        )}
        {filteredVendors.map((v) => (
          <motion.div 
            key={v.id} 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/98 backdrop-blur-sm rounded-[32px] p-6 shadow-md border-2 border-pink-primary/20 relative overflow-hidden group hover:shadow-xl hover:border-pink-primary/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-soft/40 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-300" />
            <div className="flex items-start gap-5 mb-6 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-soft to-pink-primary/20 rounded-[24px] flex items-center justify-center text-5xl shadow-md border-2 border-pink-primary/30 flex-shrink-0">
                {getEmoji(v.category)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex-1">
                    <h3 className="font-black text-lg tracking-tight text-slate-900 break-words">{v.name}</h3>
                    {v.ownerName && <p className="text-xs text-slate-500 font-bold">Operator: {v.ownerName}</p>}
                  </div>
                  {v.isVerified && <VerifiedBadge />}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-[10px] font-black bg-teal-soft text-teal-primary px-3 py-1.5 rounded-full uppercase tracking-widest">{v.category}</span>
                  {v.rating && <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">⭐ {v.rating}</span>}
                </div>
                <div className="bg-pink-50 px-4 py-2.5 rounded-xl mb-3">
                  <p className="text-xs font-black text-pink-primary tracking-wide break-all">{v.phone}</p>
                  {v.description && <p className="text-xs text-slate-600 font-bold mt-1 line-clamp-2">{v.description}</p>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative z-10 mb-3">
              <a 
                href={`tel:${v.phone}`}
                className="flex-1 bg-gradient-to-r from-pink-primary to-pink-600 hover:shadow-lg text-white font-black py-3.5 rounded-[18px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs hover:brightness-110"
              >
                <Phone size={16} />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${v.whatsapp?.replace(/[^0-9]/g, '') || v.phone?.replace(/[^0-9]/g, '') || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-teal-primary to-teal-600 hover:shadow-lg text-white font-black py-3.5 rounded-[18px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs hover:brightness-110"
              >
                <MessageCircle size={16} />
                Chat
              </a>
            </div>
            
            <div className="flex gap-2 relative z-10">
              <button 
                onClick={() => onReview(v)}
                className="flex-1 py-3 text-slate-600 font-black text-xs bg-slate-100 hover:bg-slate-200 rounded-[16px] uppercase tracking-widest active:scale-95 transition-all"
              >
                ⭐ Review
              </button>
              <button className="flex-1 py-3 text-pink-primary font-black text-xs bg-pink-soft hover:bg-pink-primary/10 rounded-[16px] uppercase tracking-widest active:scale-95 transition-all">
                ➕ Save
              </button>
            </div>
          </motion.div>
        ))}
        {filteredDrivers.map((d) => (
          <motion.div 
            key={d.id} 
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/98 backdrop-blur-sm rounded-[32px] p-6 shadow-md border-2 border-teal-primary/20 relative overflow-hidden group hover:shadow-xl hover:border-teal-primary/40 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-soft/40 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-300" />
            <div className="flex items-start gap-5 mb-6 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-soft to-teal-primary/20 rounded-[24px] flex items-center justify-center text-4xl shadow-md border-2 border-teal-primary/30 flex-shrink-0">
                🏎️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex-1">
                    <h3 className="font-black text-lg tracking-tight text-slate-900 break-words">{d.name}</h3>
                    {d.vehicleNumber && <p className="text-xs text-slate-500 font-bold">Vehicle: {d.vehicleNumber}</p>}
                  </div>
                  {d.isVerified && <VerifiedBadge />}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-[10px] font-black bg-teal-soft text-teal-primary px-3 py-1.5 rounded-full uppercase tracking-widest">{d.type}</span>
                  {d.rating && <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">⭐ {d.rating}</span>}
                </div>
                <div className="bg-teal-50 px-4 py-2.5 rounded-xl mb-3">
                  <p className="text-xs font-black text-teal-primary tracking-wide break-all">{d.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative z-10 mb-3">
              <a 
                href={`tel:${d.phone}`}
                className="flex-1 bg-gradient-to-r from-teal-primary to-teal-600 hover:shadow-lg text-white font-black py-3.5 rounded-[18px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs hover:brightness-110"
              >
                <Phone size={16} />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${d.whatsapp?.replace(/[^0-9]/g, '') || d.phone?.replace(/[^0-9]/g, '') || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-green-primary to-green-600 hover:shadow-lg text-white font-black py-3.5 rounded-[18px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs hover:brightness-110"
              >
                <MessageCircle size={16} />
                Chat
              </a>
            </div>
            
            <div className="flex gap-2 relative z-10">
              <button 
                onClick={() => onReview(d)}
                className="flex-1 py-3 text-slate-600 font-black text-xs bg-slate-100 hover:bg-slate-200 rounded-[16px] uppercase tracking-widest active:scale-95 transition-all"
              >
                ⭐ Review
              </button>
              <button className="flex-1 py-3 text-teal-primary font-black text-xs bg-teal-soft hover:bg-teal-primary/10 rounded-[16px] uppercase tracking-widest active:scale-95 transition-all">
                ➕ Save
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TransportPage = ({ onPostRide, drivers, routeFares, onReview }: { onPostRide: () => void, drivers: Driver[], routeFares: RouteFare[], onReview: (d: Driver) => void }) => {
  const [filter, setFilter] = useState<'All' | 'Auto' | 'Cab'>('All');

  const filteredDrivers = filter === 'All' 
    ? drivers 
    : drivers.filter(d => d.type === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 pb-24"
    >
      <div className="bg-pink-primary rounded-[40px] p-8 text-white mb-8 vibrant-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <h2 className="text-3xl font-bold mb-2">🛵 Campus Rides</h2>
        <p className="text-pink-soft text-sm opacity-80">Direct contact with trusted drivers.</p>
        <button 
          onClick={onPostRide}
          className="mt-4 px-6 py-3 bg-white text-pink-primary font-semibold rounded-2xl text-xs uppercase tracking-wide shadow-lg active:scale-95 transition-all hover:brightness-95"
        >
          + Post Ride Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['All', 'Auto', 'Cab'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`px-6 py-2 rounded-xl font-semibold text-xs transition-all ${
              filter === t ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <h3 className="font-semibold mb-4 text-slate-700 uppercase tracking-wide text-sm">{filter} Drivers ({filteredDrivers.length})</h3>
      <div className="flex flex-col gap-4">
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
            <p className="text-slate-600 font-bold text-lg mb-4">🚗 No drivers available</p>
            <p className="text-slate-400 text-sm mb-6">No {filter.toLowerCase()} drivers available right now.</p>
            <button onClick={onPostRide} className="text-pink-primary font-semibold uppercase text-xs tracking-wide underline hover:text-pink-hot">+ Post a ride request</button>
          </div>
        ) : (
          filteredDrivers.map((d) => (
          <motion.div 
            key={d.id} 
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-100"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-soft rounded-2xl flex items-center justify-center text-3xl">
                  {d.type === 'Auto' ? '�' : '🚖'}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{d.name}</h4>
                    {d.isVerified && <VerifiedBadge />}
                  </div>
                  {d.ownerName && <p className="text-xs text-slate-500 mb-1">Operator: {d.ownerName}</p>}
                  <span className="text-[9px] font-semibold bg-slate-100 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-wide">{d.type} Driver</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <a 
                href={`tel:${d.phone}`}
                className="flex-1 bg-pink-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-primary/20 hover:brightness-110"
              >
                <Phone size={18} />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${d.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-teal-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-primary/20 hover:brightness-110"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => onReview(d)}
                className="flex-1 py-3 text-slate-600 font-semibold text-xs bg-slate-100 hover:bg-slate-200 rounded-xl uppercase tracking-wide active:scale-95 transition-all"
              >
                ⭐ Review
              </button>
              <button 
                onClick={onPostRide}
                className="flex-1 py-3 text-pink-primary font-semibold text-xs bg-pink-soft hover:bg-pink-primary/10 rounded-xl uppercase tracking-wide active:scale-95 transition-all"
              >
                📍 Join Ride
              </button>
            </div>
          </motion.div>
        ))
        )}
      </div>
    </motion.div>
  );
};

const CommunityPage = ({ onPostRide, onPostReview, onRefer, posts, onInterest, user }: { onPostRide: () => void, onPostReview: () => void, onRefer: () => void, posts: CommunityPost[], onInterest: (id: string) => void, user: { name: string } }) => {
  const [tab, setTab] = useState<'posts' | 'feedback'>('posts');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Action Bar */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-pink-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20 mb-4">
        <button 
          onClick={onPostRide}
          className="flex-shrink-0 px-6 py-3 bg-pink-primary text-white font-semibold rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-primary/20 text-[9px] uppercase tracking-wide active:scale-95 transition-all hover:brightness-110"
        >
          <Car size={16} />
          🛵 Pool Ride
        </button>
        <button 
          onClick={onPostReview}
          className="flex-shrink-0 px-6 py-3 bg-slate-900 text-white font-semibold rounded-2xl flex items-center gap-2 shadow-lg shadow-slate-900/20 text-[9px] uppercase tracking-wide active:scale-95 transition-all hover:brightness-110"
        >
          <Star size={16} />
          ⭐ Feedback
        </button>
      </div>

      {/* Tab Selector */}
      <div className="px-6 mb-4 flex gap-2">
        <button
          onClick={() => setTab('posts')}
          className={`px-6 py-2 rounded-xl font-semibold text-xs transition-all ${
            tab === 'posts' ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          📝 Community Posts
        </button>
        <button
          onClick={() => setTab('feedback')}
          className={`px-6 py-2 rounded-xl font-semibold text-xs transition-all ${
            tab === 'feedback' ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          💬 Feedback
        </button>
      </div>

      {/* Posts Feed */}
      {tab === 'posts' && (
        <div className="px-6 pb-24 space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-6 border border-pink-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{post.userName}</h4>
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">{post.time}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[8px] font-semibold uppercase tracking-wide ${
                    post.type === 'Ride' ? 'bg-pink-soft text-pink-primary' : 'bg-teal-soft text-teal-primary'
                  }`}>
                    {post.type === 'Ride' ? '🛵' : '🍕'} {post.type}
                  </span>
                </div>

                <p className="text-sm mb-4 leading-relaxed">{post.request}</p>

                {post.type === 'Ride' && post.destination && (
                  <div className="bg-blue-soft/50 border border-blue-100 p-3 rounded-2xl mb-4">
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-blue-primary uppercase tracking-wide mb-1">
                      <MapPin size={12} />
                      {post.destination}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-blue-primary uppercase tracking-wide">
                      <Clock size={12} />
                      {post.departureTime}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${post.contact?.replace(/[^0-9]/g, '') || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:brightness-110 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle size={16} />
                    DM on WhatsApp
                  </a>
                  <button
                    onClick={() => onInterest(post.id)}
                    className={`flex-1 font-semibold py-3 rounded-xl text-[10px] uppercase tracking-wide transition-all active:scale-90 ${
                      post.interestedUsers?.includes('You')
                        ? 'bg-green-500 text-white'
                        : 'bg-pink-soft text-pink-primary hover:brightness-110'
                    }`}
                  >
                    {post.interestedUsers?.includes('You') ? '✅ Interested!' : '👋 Interested'}
                  </button>
                </div>

                {post.interestedUsers && post.interestedUsers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-pink-100">
                    <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">
                      {post.interestedUsers.filter(u => u !== 'You').length} people interested
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
              <p className="text-slate-600 font-bold text-lg mb-4">📭 No posts yet</p>
              <p className="text-slate-400 text-sm mb-6">Be the first to pool a ride or share something!</p>
            </div>
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {tab === 'feedback' && (
        <div className="px-6 pb-24">
          <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
            <p className="text-slate-600 font-bold text-lg mb-4">💬 Community Feedback</p>
            <p className="text-slate-400 text-sm mb-6">Share your experiences and feedback with PinkIt to help us improve!</p>
            <button
              onClick={onPostReview}
              className="inline-block px-6 py-3 bg-pink-primary text-white font-semibold rounded-2xl hover:brightness-110"
            >
              ⭐ Write Feedback
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ProfilePage = ({ user, onLogout, onComplaint, onFeedback }: { user: { name: string, email: string }, onLogout: () => void, onComplaint: (issue: string) => void, onFeedback: (rating: string, comment: string) => void }) => {
  const [showComplaint, setShowComplaint] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');

  const menuItems = [
    { icon: History, label: 'Order History', color: 'text-pink-primary' },
    { icon: Car, label: 'Saved Drivers', color: 'text-teal-primary' },
    { icon: ShieldAlert, label: 'Complaint History', color: 'text-slate-900' },
    { icon: Award, label: 'Volunteer Badge', color: 'text-pink-primary', badge: 'Coming Soon' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="px-6 pb-24"
    >
      <div className="flex flex-col items-center gap-6 mb-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-pink-primary p-1 shadow-2xl shadow-pink-primary/30 rotate-3">
            <div className="w-full h-full rounded-[36px] bg-pink-soft flex items-center justify-center text-pink-primary text-4xl font-bold border-4 border-white uppercase -rotate-3">
              {user.name.substring(0, 2)}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-primary rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
            <Award size={20} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold">{user.name}</h2>
          <p className="text-slate-500 font-semibold uppercase text-[9px] tracking-wide mt-1">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-pink-100 mb-8">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button 
              key={idx}
              className={`w-full flex items-center justify-between p-6 active:bg-pink-soft/30 transition-colors ${idx !== menuItems.length - 1 ? 'border-b border-pink-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl bg-pink-soft flex items-center justify-center ${item.color}`}>
                  <Icon size={20} />
                </div>
                <span className="font-semibold text-slate-700 uppercase text-xs tracking-wide">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="text-[8px] font-semibold bg-pink-primary text-white px-3 py-1 rounded-full uppercase tracking-tight">
                  {item.badge}
                </span>
              ) : (
                <ChevronRight size={18} className="text-pink-primary/30" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setShowFeedback(true)}
          className="w-full py-5 bg-white text-pink-primary font-semibold rounded-[24px] shadow-sm border border-pink-100 uppercase tracking-wide text-xs active:scale-95 transition-all hover:bg-pink-soft/20"
        >
          😊 Rate Experience
        </button>
        <button 
          onClick={() => setShowComplaint(true)}
          className="w-full py-5 bg-slate-900 text-white font-semibold rounded-[24px] shadow-2xl shadow-slate-900/20 uppercase tracking-wide text-xs active:scale-95 transition-all hover:brightness-110"
        >
          ⚠️ Raise a Complaint
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-slate-100 text-slate-400 font-semibold rounded-[24px] uppercase tracking-wide text-xs active:scale-95 transition-all hover:bg-slate-200"
        >
          👋 Logout
        </button>
      </div>

      <div className="mt-12 p-8 bg-pink-soft/50 rounded-[40px] border border-pink-100/50">
        <p className="text-[9px] text-pink-primary/40 text-center leading-relaxed uppercase font-semibold tracking-wide">
          PinkIt v2.0.0 • Built for Legends 🎓
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8"
            >
              <h3 className="text-2xl font-bold mb-2 text-center">How was your PinkIt experience?</h3>
              <p className="text-slate-500 text-center mb-8 text-sm">Your feedback helps the community.</p>
              
              <div className="flex justify-between mb-8">
                {[
                  { emoji: '😍', label: 'Loved it' },
                  { emoji: '😊', label: 'Good' },
                  { emoji: '😐', label: 'Okay' },
                  { emoji: '😠', label: 'Bad' },
                  { emoji: '😭', label: 'Disaster' },
                ].map((f, i) => (
                  <button 
                    key={i} 
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-colors ${feedbackRating === f.label ? 'bg-pink-soft' : ''}`}
                    onClick={() => setFeedbackRating(f.label)}
                  >
                    <span className="text-4xl">{f.emoji}</span>
                    <span className="text-[8px] font-semibold text-slate-400 uppercase">{f.label}</span>
                  </button>
                ))}
              </div>

              <textarea 
                placeholder="Drop tea ☕"
                className="w-full bg-pink-soft/50 rounded-2xl p-4 text-sm mb-6 focus:outline-none border-2 border-transparent focus:border-pink-primary/20"
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowFeedback(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-semibold rounded-2xl"
                >
                  Skip
                </button>
                <button 
                  onClick={() => {
                    onFeedback(feedbackRating, feedbackComment);
                    setShowFeedback(false);
                  }}
                  className="flex-1 py-4 bg-pink-primary text-white font-semibold rounded-2xl hover:brightness-110"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showComplaint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Raise a Complaint</h3>
              
              <div className="flex flex-col gap-2 mb-8">
                {['Vendor issue', 'Driver issue', 'Delay', 'Price mismatch', 'Safety issue'].map((issue) => (
                  <button 
                    key={issue} 
                    onClick={() => {
                      onComplaint(issue);
                      setShowComplaint(false);
                    }}
                    className="w-full text-left p-4 bg-pink-soft/50 rounded-2xl font-semibold text-slate-700 hover:bg-pink-soft hover:text-pink-primary transition-colors"
                  >
                    {issue}
                  </button>
                ))}
              </div>

              <p className="text-[9px] text-slate-400 mb-6 leading-relaxed">
                Disclaimer: Pinkit is a community-driven coordination platform. We do not charge commission. Payments are made directly to vendors.
              </p>

              <button 
                onClick={() => setShowComplaint(false)}
                className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:brightness-110"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminPanel = ({ vendors, drivers, onAddVendor, onEditVendor, onDeleteVendor, onAddDriver, onEditDriver, onDeleteDriver }: { 
  vendors: Vendor[], 
  drivers: Driver[], 
  onAddVendor: (v: Vendor) => void,
  onEditVendor: (v: Vendor) => void,
  onDeleteVendor: (id: string) => void,
  onAddDriver: (d: Driver) => void,
  onEditDriver: (d: Driver) => void,
  onDeleteDriver: (id: string) => void
}) => {
  const [tab, setTab] = useState<'vendors' | 'drivers'>('vendors');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 pb-24"
    >
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[40px] p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <h2 className="text-3xl font-bold mb-2">🛡️ Admin Panel</h2>
        <p className="text-slate-300 text-sm">Manage vendors and drivers</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('vendors')}
          className={`px-6 py-2 rounded-xl font-semibold text-xs transition-all ${
            tab === 'vendors' ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          📦 Vendors ({vendors.length})
        </button>
        <button
          onClick={() => setTab('drivers')}
          className={`px-6 py-2 rounded-xl font-semibold text-xs transition-all ${
            tab === 'drivers' ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
          }`}
        >
          🚗 Drivers ({drivers.length})
        </button>
      </div>

      {tab === 'vendors' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddVendor(true)}
            className="w-full py-3 bg-pink-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
          >
            <PlusCircle size={18} />
            Add New Vendor
          </button>
          <div className="space-y-3">
            {vendors.map(v => (
              <div key={v.id} className="bg-white rounded-[24px] p-4 border border-pink-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{v.name}</h4>
                    <p className="text-xs text-slate-500">{v.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingVendor(v)}
                      className="p-2 bg-blue-soft text-blue-primary rounded-lg hover:brightness-110"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteVendor(v.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:brightness-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{v.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'drivers' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddDriver(true)}
            className="w-full py-3 bg-teal-primary text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
          >
            <PlusCircle size={18} />
            Add New Driver
          </button>
          <div className="space-y-3">
            {drivers.map(d => (
              <div key={d.id} className="bg-white rounded-[24px] p-4 border border-pink-100">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{d.name}</h4>
                    <p className="text-xs text-slate-500">{d.type} Driver</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDriver(d)}
                      className="p-2 bg-blue-soft text-blue-primary rounded-lg hover:brightness-110"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteDriver(d.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:brightness-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{d.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// --- Main App ---

type AppData = {
  vendors: Vendor[];
  drivers: Driver[];
  communityPosts: CommunityPost[];
  routeFares: RouteFare[];
  essentialServices: EssentialService[];
};

export default function App() {
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isPostRideOpen, setIsPostRideOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<Vendor | Driver | null>(null);
  
  const [appData, setAppData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-login from localStorage for persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('pinkit_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      const savedAdmin = localStorage.getItem('pinkit_admin') === 'true';
      setIsAdmin(savedAdmin);
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    const adminStatus = ADMIN_EMAILS.includes(email);
    setUser(newUser);
    setIsAdmin(adminStatus);
    localStorage.setItem('pinkit_user', JSON.stringify(newUser));
    localStorage.setItem('pinkit_admin', adminStatus.toString());
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('pinkit_user');
    localStorage.removeItem('pinkit_admin');
  };

  const fetchAllData = async (force = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dataService.fetchData(force);
      setAppData(data);
    } catch (err) {
      setError('Could not load latest campus services. Please check your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCategoryClick = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveTab('services');
  };

  const handlePostToCommunity = async (type: 'Ride' | 'Order', details: any) => {
    if (!user) return;
    try {
      const request = type === 'Ride' 
        ? `Heading to ${details.dest}. Anyone wants to share a ride? 🛵`
        : `Ordering from ${details.place}. Anyone wants to pool? 🍜`;
        
      await dataService.postCommunityPost({
        userName: user.name,
        request,
        time: 'Just now',
        type,
        contact: user.email,
        destination: details.dest,
        departureTime: details.time
      });
      fetchAllData(true);
      setActiveTab('community');
    } catch (err) {
      alert(`Failed to post ${type.toLowerCase()} request.`);
    }
  };

  const handlePostReview = async (rating: number, comment: string) => {
    if (!reviewTarget || !user) return;
    try {
      await dataService.postFeedback({
        userName: user.name,
        vendorOrDriverId: reviewTarget.id,
        rating: rating.toString(),
        comment,
        timestamp: new Date().toISOString()
      });
      alert('Thank you for your review!');
      fetchAllData(true);
    } catch (err) {
      alert('Failed to post review.');
    }
  };

  const handleReferContact = async (data: any) => {
    if (!user) return;
    try {
      await dataService.postCommunityPost({
        userName: user.name,
        request: `Suggested new contact: ${data.name} (${data.category}) - ${data.phone}. ${data.description}`,
        time: 'Just now',
        type: 'Review',
        contact: user.email
      });
      alert(`Thanks for referring ${data.name}! We'll verify and add it soon.`);
    } catch (err) {
      alert('Failed to submit referral.');
    }
  };

  const handleComplaint = async (issue: string) => {
    if (!user) return;
    try {
      await dataService.postComplaint({
        userName: user.name,
        serviceType: 'General',
        issueType: issue,
        description: `Student reported: ${issue}`,
        timestamp: new Date().toISOString()
      });
      alert('Complaint registered. We will look into it.');
    } catch (err) {
      alert('Failed to register complaint.');
    }
  };

  const handleAppFeedback = async (rating: string, comment: string) => {
    if (!user) return;
    try {
      await dataService.postFeedback({
        userName: user.name,
        vendorOrDriverId: 'APP_FEEDBACK',
        rating,
        comment,
        timestamp: new Date().toISOString()
      });
      alert('Thank you for your feedback!');
    } catch (err) {
      alert('Failed to submit feedback.');
    }
  };

  const handleInterest = (id: string) => {
    // Optimistic update for UI
    if (!appData) return;
    const newPosts = appData.communityPosts.map(p => {
      if (p.id === id) {
        const interested = p.interestedUsers || [];
        if (interested.includes('You')) return p;
        return { ...p, interestedUsers: [...interested, 'You'] };
      }
      return p;
    });
    setAppData({ ...appData, communityPosts: newPosts });
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      if (appData) {
        setAppData({
          ...appData,
          vendors: appData.vendors.filter(v => v.id !== vendorId)
        });
      }
      alert('Vendor deleted!');
    }
  };

  const handleDeleteDriver = (driverId: string) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      if (appData) {
        setAppData({
          ...appData,
          drivers: appData.drivers.filter(d => d.id !== driverId)
        });
      }
      alert('Driver deleted!');
    }
  };

  const filteredVendors = (appData?.vendors || []).filter(v => {
    const matchesSearch = searchQuery === '' || 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredDrivers = (appData?.drivers || []).filter(d => {
    const matchesSearch = searchQuery === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const renderPage = (isLoading: boolean, appData: AppData | null, error: string | null, searchQuery: string) => {
    if (isLoading && !appData) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
          <div className="w-12 h-12 border-4 border-pink-soft border-t-pink-primary rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold">Loading campus services...</p>
        </div>
      );
    }

    if (error && !appData) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
          <AlertCircle size={48} className="text-pink-primary mb-4" />
          <p className="text-slate-800 font-bold mb-4">{error}</p>
          <button 
            onClick={() => fetchAllData(true)}
            className="px-6 py-3 bg-pink-primary text-white font-bold rounded-2xl"
          >
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onCategoryClick={handleCategoryClick} vendors={filteredVendors} drivers={filteredDrivers} />;
      case 'services':
        return (
          <ServicesPage 
            selectedCategory={selectedCategory} 
            onBack={() => setSelectedCategory(null)} 
            onRefer={() => setIsReferOpen(true)}
            vendors={filteredVendors}
            drivers={filteredDrivers}
            essentialServices={appData?.essentialServices || []}
            onReview={(v) => {
              setReviewTarget(v);
              setIsReviewOpen(true);
            }}
            onCategorySelect={(cat) => setSelectedCategory(cat)}
            onPostRide={() => setIsPostRideOpen(true)}
          />
        );
      case 'community':
        return (
          <CommunityPage 
            onPostRide={() => setIsPostRideOpen(true)} 
            onPostReview={() => {
              setReviewTarget(null);
              setIsReviewOpen(true);
            }}
            onRefer={() => setIsReferOpen(true)}
            posts={appData?.communityPosts || []}
            onInterest={handleInterest}
            user={user}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            vendors={appData?.vendors || []}
            drivers={appData?.drivers || []}
            onAddVendor={() => {}}
            onEditVendor={() => {}}
            onDeleteVendor={handleDeleteVendor}
            onAddDriver={() => {}}
            onEditDriver={() => {}}
            onDeleteDriver={handleDeleteDriver}
          />
        );
      case 'profile':
        return <ProfilePage user={user} onLogout={handleLogout} onComplaint={handleComplaint} onFeedback={handleAppFeedback} />;
      default:
        return <HomePage onCategoryClick={handleCategoryClick} vendors={filteredVendors} drivers={filteredDrivers} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home': return 'PinkIt';
      case 'services': return selectedCategory ? `${selectedCategory}` : 'Services';
      case 'community': return 'Community';
      case 'admin': return 'Admin Panel';
      case 'profile': return 'Profile';
      default: return 'PinkIt';
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-pink-soft relative flex flex-col items-center">
      {/* Background Image */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <img 
          src="https://i.postimg.cc/d1Yj855X/Whats-App-Image-2026-03-05-at-7-56-38-PM.jpg" 
          alt="Background" 
          className="w-full h-full object-cover blur-3xl"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="w-full max-w-2xl bg-white/40 backdrop-blur-sm min-h-screen relative pb-24 shadow-2xl shadow-pink-primary/5 z-10 border-x border-pink-100/50">
        <Header 
          title={getPageTitle()} 
          showSearch={activeTab === 'home' || activeTab === 'services'} 
          onSearch={setSearchQuery} 
          onRefresh={() => fetchAllData(true)}
          isLoading={isLoading}
          user={user}
        />
      
      {/* Pull to refresh indicator */}
      {isLoading && appData && (
        <div className="absolute top-24 left-0 right-0 flex justify-center z-30">
          <div className="bg-white shadow-md rounded-full p-2">
            <div className="w-5 h-5 border-2 border-pink-soft border-t-pink-primary rounded-full animate-spin" />
          </div>
        </div>
      )}

      <main className="pt-4">
        <AnimatePresence mode="wait">
          {renderPage(isLoading, appData, error, searchQuery)}
        </AnimatePresence>
      </main>
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'services') setSelectedCategory(null);
          setSearchQuery('');
        }}
        onBackClick={() => setSelectedCategory(null)}
        isAdmin={isAdmin}
      />

      <PostCommunityModal 
        isOpen={isPostRideOpen} 
        onClose={() => setIsPostRideOpen(false)} 
        onSubmit={handlePostToCommunity} 
      />

      <ReviewModal 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        targetName={reviewTarget?.name || 'Service'}
        onSubmit={handlePostReview}
      />

      <SuggestContactModal 
        isOpen={isReferOpen}
        onClose={() => setIsReferOpen(false)}
        onSubmit={handleReferContact}
      />
      </div>
    </div>
  );
}