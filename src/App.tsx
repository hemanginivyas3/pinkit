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
  Send
} from 'lucide-react';
import { Category, Vendor, Driver, CommunityPost, Review, RouteFare, EssentialService, RohtakSpot, PriceTag } from './types';
import { ROHTAK_SPOTS } from './constants';
import dataService from './services/dataService';

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

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon, emoji: '🏠' },
    { id: 'services', label: 'Services', icon: LayoutGrid, emoji: '🛒' },
    { id: 'transport', label: 'Transport', icon: Car, emoji: '🚗' },
    { id: 'community', label: 'Community', icon: Users, emoji: '👥' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/90 backdrop-blur-xl border-t border-pink-100 px-6 py-4 pb-8 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_30px_rgba(255,45,85,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0'}`}>{tab.label}</span>
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
          <h1 className="text-3xl font-black tracking-tighter text-pink-hot italic leading-none">
            {title === 'PinkIt' ? '🎓 PinkIt' : title}
          </h1>
          <p className="text-[9px] font-bold text-pink-primary/60 uppercase tracking-widest">Campus Legends Only</p>
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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-soft to-pink-primary/20 flex items-center justify-center text-pink-primary font-black border-2 border-pink-100 shadow-sm uppercase text-sm tracking-tighter">
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
          className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-md border-2 border-pink-primary/20 focus:outline-none focus:border-pink-primary/50 transition-all placeholder:text-slate-400"
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
        className="relative z-10 text-6xl font-black text-white mb-2 italic tracking-tighter drop-shadow-2xl\">
        PinkIt
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 text-pink-soft mb-12 text-center font-bold drop-shadow-lg"
      >
        Campus coordination, <span className="text-pink-primary font-black">simplified.</span> 🎯
      </motion.p>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-6 mb-10"
      >
        <div className="relative">
          <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Your Name</label>
          <input 
            type="text" 
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-white/10 backdrop-blur-xl rounded-[24px] p-5 text-sm font-bold text-white placeholder:text-white/40 focus:outline-none border-2 border-white/10 focus:border-pink-primary/40 shadow-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="relative">
          <label className="text-[10px] font-black text-pink-primary uppercase mb-2 block ml-4 tracking-widest">Campus Email</label>
          <input 
            type="email" 
            placeholder="rahul@campus.edu"
            className="w-full bg-white/10 backdrop-blur-xl rounded-[24px] p-5 text-sm font-bold text-white placeholder:text-white/40 focus:outline-none border-2 border-white/10 focus:border-pink-primary/40 shadow-xl"
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
        className="relative z-10 w-full max-w-sm py-5 bg-pink-primary text-white font-black rounded-[24px] shadow-2xl shadow-pink-primary/40 disabled:opacity-50 transition-all active:scale-95 uppercase tracking-widest text-sm"
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
      <h2 className="text-2xl font-black mb-6 italic text-pink-hot tracking-tighter">⚡ Quick Fixes</h2>
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
          <h2 className="text-xl font-black italic text-pink-hot">Popular Spots ✨</h2>
          <span className="text-[10px] font-black bg-pink-primary text-white px-2 py-1 rounded-full uppercase">Top Picks</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {ROHTAK_SPOTS.map((spot) => (
            <div key={spot.id} className="min-w-[260px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-pink-100 p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-lg leading-tight">{spot.name}</h3>
                <span className="text-[10px] font-black bg-teal-soft text-teal-primary px-2 py-1 rounded-lg uppercase">{spot.type}</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2 font-medium">{spot.description}</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-pink-primary bg-pink-soft w-fit px-3 py-1 rounded-full">
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

const ServicesPage = ({ selectedCategory, onBack, onRefer, vendors, essentialServices, onReview, onCategorySelect }: { selectedCategory: Category | null, onBack: () => void, onRefer: () => void, vendors: Vendor[], essentialServices: EssentialService[], onReview: (v: Vendor) => void, onCategorySelect: (cat: Category) => void }) => {
  const filteredVendors = selectedCategory 
    ? vendors.filter(v => v.category === selectedCategory)
    : vendors;

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
            <button onClick={onBack} className="p-3 bg-pink-soft text-pink-primary rounded-2xl active:scale-90 transition-all">
              <ChevronRight size={20} className="rotate-180" />
            </button>
          )}
          <h2 className="text-2xl font-black italic tracking-tighter text-pink-hot">
            {selectedCategory ? `${getEmoji(selectedCategory)} ${selectedCategory}` : '✨ All Services'}
          </h2>
        </div>
        <button 
          onClick={onRefer}
          className="p-3 bg-pink-primary text-white rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-primary/20 active:scale-95 transition-all"
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
        {filteredVendors.length === 0 && selectedCategory && (
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
        <h2 className="text-3xl font-black mb-2 italic">🛵 Campus Rides</h2>
        <p className="text-pink-soft text-sm font-bold opacity-80">Direct contact with trusted drivers.</p>
        <button 
          onClick={onPostRide}
          className="mt-4 px-6 py-3 bg-white text-pink-primary font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
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
            className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${
              filter === t ? 'bg-pink-primary text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <h3 className="font-bold mb-4 text-slate-700 uppercase tracking-wider text-sm">{filter} Drivers ({filteredDrivers.length})</h3>
      <div className="flex flex-col gap-4">
        {filteredDrivers.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white/80 rounded-[40px] border-2 border-dashed border-pink-200">
            <p className="text-slate-600 font-black text-lg mb-4">🚗 No drivers available</p>
            <p className="text-slate-400 font-bold text-sm mb-6">No {filter.toLowerCase()} drivers available right now.</p>
            <button onClick={onPostRide} className="text-pink-primary font-black uppercase text-xs tracking-widest underline hover:text-pink-hot">+ Post a ride request</button>
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
                    <h4 className="font-black text-xl">{d.name}</h4>
                    {d.isVerified && <VerifiedBadge />}
                  </div>
                  {d.ownerName && <p className="text-xs text-slate-500 font-bold mb-1">Operator: {d.ownerName}</p>}
                  <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-wider">{d.type} Driver</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <a 
                href={`tel:${d.phone}`}
                className="flex-1 bg-pink-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-pink-primary/20"
              >
                <Phone size={18} />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${d.whatsapp.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-teal-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-primary/20"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => onReview(d)}
                className="flex-1 py-3 text-slate-600 font-black text-xs bg-slate-100 hover:bg-slate-200 rounded-xl uppercase tracking-wider active:scale-95 transition-all"
              >
                ⭐ Review
              </button>
              <button 
                onClick={onPostRide}
                className="flex-1 py-3 text-pink-primary font-black text-xs bg-pink-soft hover:bg-pink-primary/10 rounded-xl uppercase tracking-wider active:scale-95 transition-all"
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
  const [message, setMessage] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {/* Action Bar */}
      <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-b border-pink-100 bg-white/50 backdrop-blur-sm sticky top-0 z-20">
        <button 
          onClick={onPostRide}
          className="flex-shrink-0 px-6 py-3 bg-pink-primary text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-pink-primary/20 text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          <Car size={16} />
          🛵 Pool Ride
        </button>
        <button 
          onClick={() => setMessage('I am ordering from [Place]. Anyone wants to pool? 🍕')}
          className="flex-shrink-0 px-6 py-3 bg-teal-primary text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-teal-primary/20 text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          <ShoppingBag size={16} />
          🍕 Pool Order
        </button>
        <button 
          onClick={onPostReview}
          className="flex-shrink-0 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl flex items-center gap-2 shadow-lg shadow-slate-900/20 text-[10px] uppercase tracking-widest active:scale-95 transition-all"
        >
          <Star size={16} />
          ⭐ Review
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 no-scrollbar">
        {posts.map((post, idx) => {
          const isMe = post.userName === user.name;
          return (
            <motion.div 
              key={post.id} 
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-2 mb-1 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.userName}</span>
                <span className="text-[9px] font-bold text-slate-300 uppercase">{post.time}</span>
              </div>
              
              <div className={`max-w-[85%] p-5 rounded-[32px] shadow-sm border ${
                isMe 
                  ? 'bg-pink-primary text-white border-pink-primary rounded-tr-none' 
                  : 'bg-white text-slate-800 border-pink-100 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    isMe ? 'bg-white/20 text-white' : 'bg-pink-soft text-pink-primary'
                  }`}>
                    {post.type}
                  </span>
                </div>
                
                <p className="text-sm font-medium leading-relaxed">
                  {post.request}
                </p>

                {post.type === 'Ride' && post.destination && (
                  <div className={`mt-4 p-3 rounded-2xl flex flex-col gap-1 border ${
                    isMe ? 'bg-white/10 border-white/20' : 'bg-blue-soft/50 border-blue-100'
                  }`}>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                      <MapPin size={12} />
                      <span>{post.destination}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                      <Clock size={12} />
                      <span>{post.departureTime}</span>
                    </div>
                  </div>
                )}

                <div className={`mt-4 flex gap-2 ${isMe ? 'justify-end' : ''}`}>
                  {!isMe && (
                    <a 
                      href={`tel:${post.contact}`}
                      className="p-2 bg-white/20 rounded-xl text-white hover:bg-white/30 transition-colors"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                  <button 
                    onClick={() => onInterest(post.id)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-90 ${
                      post.interestedUsers?.includes('You')
                        ? 'bg-green-500 text-white'
                        : isMe ? 'bg-white/20 text-white' : 'bg-pink-soft text-pink-primary'
                    }`}
                  >
                    {post.interestedUsers?.includes('You') ? '✅ Joined!' : "🙋 I'm In!"}
                  </button>
                </div>
              </div>
              
              {post.interestedUsers && post.interestedUsers.length > 0 && (
                <div className="mt-2 px-2 flex -space-x-2">
                  {post.interestedUsers.map((u, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-teal-primary border-2 border-white flex items-center justify-center text-[8px] font-black text-white uppercase">
                      {u.charAt(0)}
                    </div>
                  ))}
                  <span className="ml-4 text-[9px] font-black text-teal-primary uppercase self-center">
                    +{post.interestedUsers.length} interested
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-xl border-t border-pink-100 flex gap-3 items-center">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Share your thoughts & feedback..." 
            className="w-full bg-pink-soft/50 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none border-2 border-transparent focus:border-pink-primary/20 transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && message) {
                // Handle send
                setMessage('');
              }
            }}
          />
        </div>
        <button 
          onClick={() => {
            if (message) {
              // Handle send
              setMessage('');
            }
          }}
          className="w-12 h-12 bg-pink-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-primary/20 active:scale-90 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
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
            <div className="w-full h-full rounded-[36px] bg-pink-soft flex items-center justify-center text-pink-primary text-4xl font-black border-4 border-white uppercase -rotate-3">
              {user.name.substring(0, 2)}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-teal-primary rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white">
            <Award size={20} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black italic tracking-tighter">{user.name}</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">{user.email}</p>
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
                <span className="font-black text-slate-700 uppercase text-xs tracking-wider">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="text-[9px] font-black bg-pink-primary text-white px-3 py-1 rounded-full uppercase tracking-tighter">
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
          className="w-full py-5 bg-white text-pink-primary font-black rounded-[24px] shadow-sm border border-pink-100 uppercase tracking-widest text-xs active:scale-95 transition-all"
        >
          😊 Rate Experience
        </button>
        <button 
          onClick={() => setShowComplaint(true)}
          className="w-full py-5 bg-slate-900 text-white font-black rounded-[24px] shadow-2xl shadow-slate-900/20 uppercase tracking-widest text-xs active:scale-95 transition-all"
        >
          ⚠️ Raise a Complaint
        </button>
        <button 
          onClick={onLogout}
          className="w-full py-5 bg-slate-100 text-slate-400 font-black rounded-[24px] uppercase tracking-widest text-xs active:scale-95 transition-all"
        >
          👋 Logout
        </button>
      </div>

      <div className="mt-12 p-8 bg-pink-soft/50 rounded-[40px] border border-pink-100/50">
        <p className="text-[10px] text-pink-primary/40 text-center leading-relaxed uppercase font-black tracking-[0.2em]">
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
              <h3 className="text-2xl font-black mb-2 text-center">How was your PinkIt experience?</h3>
              <p className="text-slate-500 text-center mb-8">Your feedback helps the community.</p>
              
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{f.label}</span>
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
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl"
                >
                  Skip
                </button>
                <button 
                  onClick={() => {
                    onFeedback(feedbackRating, feedbackComment);
                    setShowFeedback(false);
                  }}
                  className="flex-1 py-4 bg-pink-primary text-white font-bold rounded-2xl"
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
              <h3 className="text-2xl font-black mb-6">Raise a Complaint</h3>
              
              <div className="flex flex-col gap-2 mb-8">
                {['Vendor issue', 'Driver issue', 'Delay', 'Price mismatch', 'Safety issue'].map((issue) => (
                  <button 
                    key={issue} 
                    onClick={() => {
                      onComplaint(issue);
                      setShowComplaint(false);
                    }}
                    className="w-full text-left p-4 bg-pink-soft/50 rounded-2xl font-bold text-slate-700 hover:bg-pink-soft hover:text-pink-primary transition-colors"
                  >
                    {issue}
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 mb-6 leading-relaxed italic">
                Disclaimer: Pinkit is a community-driven coordination platform. We do not charge commission. Payments are made directly to vendors.
              </p>

              <button 
                onClick={() => setShowComplaint(false)}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl"
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
    }
  }, []);

  const handleLogin = (name: string, email: string) => {
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('pinkit_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pinkit_user');
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
            essentialServices={appData?.essentialServices || []}
            onReview={(v) => {
              setReviewTarget(v);
              setIsReviewOpen(true);
            }}
            onCategorySelect={(cat) => setSelectedCategory(cat)}
          />
        );
      case 'transport':
        return (
          <TransportPage 
            onPostRide={() => setIsPostRideOpen(true)} 
            drivers={filteredDrivers}
            routeFares={appData?.routeFares || []}
            onReview={(d) => {
              setReviewTarget(d);
              setIsReviewOpen(true);
            }}
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
      case 'transport': return 'Transport';
      case 'community': return 'Community';
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
      <BottomNav activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab !== 'services') setSelectedCategory(null);
        setSearchQuery('');
      }} />

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