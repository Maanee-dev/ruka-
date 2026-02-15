import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// Use namespace import and destructuring to resolve potential environment/type export issues
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Waves, Calendar, MapPin, Phone, Mail, Instagram, 
  LayoutDashboard, FileText, BarChart3, Settings,
  Users, CheckCircle2, Plus, Trash2, Upload, X,
  DollarSign, ArrowRight, ShieldCheck, TrendingUp, Briefcase, 
  MessageSquare, Star, Sun, Anchor, Palmtree, Download, AlertCircle,
  Clock, CreditCard, ChevronDown, BedDouble
} from 'lucide-react';
// Use native Date constructor instead of parseISO which may be missing in some library versions/types
import { format, addDays } from 'date-fns';
import { AppProvider, useStore } from './store';
import { Navbar } from './components/Layout';
import { EXPERIENCES, ADDONS } from './constants';
import { RoomType, Room, Booking, RateRule } from './types';
import { calculateStayTotal } from './utils/rateCalculator';

const { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } = ReactRouterDOM as any;

// --- SHARED COMPONENTS ---

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-1 text-gold">
    {[...Array(count)].map((_, i) => (
      <Star key={i} className="w-3 h-3 fill-current" />
    ))}
  </div>
);

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-4 my-8">
    <div className="w-12 h-[1px] bg-gold opacity-30" />
    <Waves className="w-5 h-5 text-gold opacity-60" />
    <div className="w-12 h-[1px] bg-gold opacity-30" />
  </div>
);

const Footer = () => {
  const { cms } = useStore();
  return (
    <footer className="bg-obsidian text-slate-400 py-24 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-16 text-center md:text-left">
          <div className="col-span-2">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-4 mb-10">
              <div className="p-2 border border-gold/30 rounded-full">
                <Waves className="w-8 h-8 text-gold" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-white">
                RUKA <span className="text-gold">MALDIVES</span>
              </span>
            </Link>
            <p className="max-w-md mx-auto md:mx-0 mb-10 leading-relaxed opacity-60 font-medium">
              Discover a hidden sanctuary on Dhiffushi Island. Ruka Maldives offers a refined escape where luxury craftsmanship meets the vibrant soul of the Indian Ocean.
            </p>
            <div className="flex justify-center md:justify-start gap-6">
              {[Instagram, MessageSquare, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-serif text-xl font-bold mb-8 italic">Quick Links</h4>
            <ul className="space-y-4 text-[10px] font-bold tracking-[0.2em] uppercase">
              <li><Link to="/rooms" className="hover:text-gold transition-colors">Luxury Rooms</Link></li>
              <li><Link to="/experiences" className="hover:text-gold transition-colors">Island Adventures</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/admin" className="hover:text-gold transition-colors">Management Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif text-xl font-bold mb-8 italic">Contact Info</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-4">
                <Mail className="w-4 h-4 text-gold" /> 
                <span className="opacity-70 font-medium">{cms.contactEmail}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4">
                <Phone className="w-4 h-4 text-gold" /> 
                <span className="opacity-70 font-medium">{cms.contactPhone}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-4">
                <MapPin className="w-4 h-4 text-gold" /> 
                <span className="opacity-70 font-medium">Dhiffushi Island, Maldives</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-20 pt-10 text-[10px] text-center uppercase tracking-[0.4em] opacity-30 font-bold">
          &copy; {new Date().getFullYear()} Ruka Maldives Guest House. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

// --- GUEST PAGES ---

const HomePage = () => {
  const { cms, rooms } = useStore();
  const navigate = useNavigate();
  
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573812195421-50a396d17893?auto=format&fit=crop&q=80&w=2400" 
            alt="Luxury Maldives Guest House" 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 luxury-overlay" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl pt-20 flex flex-col items-center">
          <div className="mb-8">
            <StarRating />
          </div>
          <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-6">LUXURY HOTEL AND RESORT</p>
          <h1 className="text-5xl md:text-8xl font-serif font-bold mb-10 leading-[1.1] animate-in fade-in slide-in-from-bottom-12 duration-1000">
            THE BEST LUXURY HOTEL<br />
            <span className="italic font-normal">IN DHIFFUSHI</span>
          </h1>
          <button 
            onClick={() => document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gold hover:bg-gold-hover text-white px-12 py-5 rounded-none font-bold uppercase tracking-[0.3em] text-[11px] transition-all transform hover:scale-105 shadow-2xl"
          >
            TAKE A TOUR
          </button>
        </div>

        {/* Floating Booking Bar - Mimicking reference image */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 md:px-0 translate-y-1/2">
          <div className="max-w-6xl mx-auto bg-obsidian text-white p-1 md:p-2 grid grid-cols-1 md:grid-cols-4 gap-0 items-stretch border-b-4 border-gold shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
            <div className="p-6 border-r border-white/5 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                Check-in <Calendar className="w-3 h-3" />
              </label>
              <input type="date" className="bg-transparent text-sm font-bold outline-none cursor-pointer" defaultValue={format(addDays(new Date(), 7), 'yyyy-MM-dd')} />
            </div>
            <div className="p-6 border-r border-white/5 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2 flex items-center gap-2">
                Check-out <Calendar className="w-3 h-3" />
              </label>
              <input type="date" className="bg-transparent text-sm font-bold outline-none cursor-pointer" defaultValue={format(addDays(new Date(), 14), 'yyyy-MM-dd')} />
            </div>
            <div className="p-6 border-r border-white/5 flex flex-col justify-center">
              <label className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Guests</label>
              <select className="bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none w-full">
                <option className="bg-obsidian">02 ADULTS, 01 CHILD</option>
                <option className="bg-obsidian">01 ADULT</option>
                <option className="bg-obsidian">02 ADULTS</option>
                <option className="bg-obsidian">04 ADULTS</option>
              </select>
            </div>
            <button 
              onClick={() => navigate('/rooms')}
              className="bg-gold hover:bg-gold-hover text-white font-bold uppercase tracking-[0.3em] text-xs transition-colors flex items-center justify-center min-h-[80px]"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms-section" className="py-52 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-28">
            <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-4">ROYELLA'S ROOMS & SUITES</p>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-obsidian uppercase italic mb-8">
              Luxury Sanctuaries
            </h2>
            <div className="w-20 h-0.5 bg-gold mx-auto opacity-30" />
            <p className="text-slate-500 max-w-xl mx-auto font-medium mt-8 leading-relaxed">
              Proactively morph optimal infomediaries rather than include expertise. Seamlessly professional measure other than research-based.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {rooms.slice(0, 3).map(room => (
              <div key={room.id} className="bg-white group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden" onClick={() => navigate(`/book?roomId=${room.id}`)}>
                <div className="relative h-[320px] overflow-hidden">
                  <img src={room.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={room.name} />
                  <div className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-gold border-l-2 border-gold">
                    FROM ${room.baseRate} / NIGHT
                  </div>
                </div>
                <div className="p-10">
                  <p className="text-[9px] text-gold uppercase font-bold tracking-[0.3em] mb-3">DHIFFUSHI, MALDIVES</p>
                  <h3 className="text-2xl font-serif font-bold text-obsidian mb-6 italic group-hover:text-gold transition-colors">{room.name}</h3>
                  
                  <div className="flex items-center justify-between py-6 border-y border-slate-50 mb-8">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <BedDouble className="w-4 h-4 text-gold opacity-50" /> {room.maxOccupancy} Guests
                    </div>
                    <StarRating />
                  </div>
                  
                  <div className="flex justify-center">
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian border-b border-gold/40 pb-2 group-hover:border-gold group-hover:text-gold transition-all">
                      VIEW DETAILS <ArrowRight className="w-3 h-3 ml-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-20">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <div className="w-2 h-2 rounded-full bg-gold/30" />
              <div className="w-2 h-2 rounded-full bg-gold/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section - Redesigned to match the "asymmetrical" luxury style */}
      <section className="py-48 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-6 relative">
              <div className="relative z-10 w-[90%] border-[20px] border-cream shadow-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1544918877-460635b6d13e?auto=format&fit=crop&q=80&w=1400" 
                  className="w-full grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105" 
                  alt="Resort Life" 
                />
              </div>
              <div className="absolute -bottom-10 -right-4 w-3/4 h-3/4 bg-obsidian -z-0 translate-x-1/4 translate-y-1/4 opacity-5" />
              <div className="absolute top-1/2 -left-12 -translate-y-1/2 hidden lg:flex flex-col gap-6">
                <div className="bg-obsidian p-6 border-b-4 border-gold shadow-2xl">
                  <Star className="w-8 h-8 text-gold fill-current mx-auto" />
                </div>
              </div>
            </div>
            
            <div className="md:col-span-6 lg:pl-16">
              <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-6">LUXURY HOTEL AND RESORT</p>
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-obsidian italic mb-10 leading-[1.2]">
                LUXURY BEST HOTEL IN CITY<br />
                <span className="text-gold">CALIFORNTIA, USA</span>
              </h2>
              <p className="text-slate-500 mb-12 leading-relaxed font-medium">
                Significantly more collaborate cross-platform traditional capital after marketing-based. Appropriately create interactive infrastructures after maintainable models. Distinctly facilitate world-class Compellingly create powder light throughout seamlessly.
              </p>
              
              <div className="grid grid-cols-2 gap-12 mb-16 border-t border-slate-50 pt-12">
                <div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <p className="text-5xl font-serif font-bold text-obsidian italic">250</p>
                    <Plus className="w-6 h-6 text-gold" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">Luxury Rooms</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-5xl font-serif font-bold text-obsidian italic">4.9</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">Customer Survey</p>
                </div>
              </div>
              
              <button className="bg-gold hover:bg-gold-hover text-white px-12 py-5 rounded-none font-bold uppercase tracking-[0.3em] text-[10px] transition-all shadow-2xl">
                ABOUT MORE
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-pattern -z-0 pointer-events-none" />
      </section>

      {/* Social Proof Bar */}
      <section className="bg-obsidian py-24 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-40 grayscale contrast-125">
          <Waves className="w-16 h-16 text-white" />
          <Sun className="w-16 h-16 text-white" />
          <Anchor className="w-16 h-16 text-white" />
          <Palmtree className="w-16 h-16 text-white" />
          <Waves className="w-16 h-16 text-white" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

const RoomsPage = () => {
  const { rooms } = useStore();
  return (
    <div className="pt-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="text-center mb-24">
          <GoldDivider />
          <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-4">PRIVATE SANCTUARIES</p>
          <h1 className="text-6xl font-serif font-bold text-obsidian italic uppercase">Our Rooms</h1>
        </div>
        
        <div className="grid gap-32">
          {rooms.map((room, idx) => (
            <div key={room.id} className={`bg-white shadow-2xl border border-gold/5 flex flex-col md:flex-row ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2 h-[550px] overflow-hidden group">
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              </div>
              <div className="md:w-1/2 p-12 md:p-20 flex flex-col justify-center relative">
                <div className="absolute top-10 right-10 text-gold opacity-10">
                   <BedDouble className="w-32 h-32" />
                </div>
                <span className="text-gold font-bold tracking-[0.4em] text-[9px] uppercase mb-6 italic block">{room.type}</span>
                <h2 className="text-4xl font-serif font-bold mb-10 italic text-obsidian leading-tight">{room.name}</h2>
                <p className="text-slate-500 mb-12 leading-relaxed font-medium text-sm">{room.description}</p>
                <div className="grid grid-cols-2 gap-y-6 gap-x-10 mb-12">
                  {room.amenities.map(a => (
                    <div key={a} className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      <div className="w-1 h-1 bg-gold rounded-full" /> {a}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-12">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase font-bold tracking-[0.3em] block mb-2">STAY TOTAL FROM</span>
                    <p className="text-4xl font-serif font-bold text-obsidian">${room.baseRate}<span className="text-sm font-normal text-slate-400 tracking-normal"> / NIGHT</span></p>
                  </div>
                  <Link to={`/book?roomId=${room.id}`} className="bg-obsidian text-white px-12 py-5 rounded-none font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gold transition-all shadow-2xl">
                    CHECK RATES
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { rooms, rates, addBooking } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const roomId = searchParams.get('roomId');
  const selectedRoom = rooms.find(r => r.id === roomId) || rooms[0];

  const [bookingData, setBookingData] = useState({
    checkIn: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    adults: 2,
    children: 0,
    guestName: '',
    email: '',
    selectedAddOns: [] as string[]
  });

  const calculation = useMemo(() => {
    return calculateStayTotal(
      selectedRoom,
      bookingData.checkIn,
      bookingData.checkOut,
      bookingData.adults,
      bookingData.children,
      rates
    );
  }, [selectedRoom, bookingData, rates]);

  const addOnTotal = bookingData.selectedAddOns.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id);
    if (!addon) return acc;
    let price = addon.price;
    if (addon.type === 'per_person') price *= (bookingData.adults + bookingData.children);
    if (addon.frequency === 'per_night') price *= calculation.nights;
    return acc + price;
  }, 0);

  const grandTotal = calculation.total + addOnTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.guestName || !bookingData.email) {
      alert("Please fill in your details.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        roomId: selectedRoom.id,
        guestName: bookingData.guestName,
        email: bookingData.email,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        totalAmount: grandTotal,
        status: 'confirmed',
        addOns: bookingData.selectedAddOns,
        createdAt: new Date().toISOString()
      };
      addBooking(newBooking);
      setIsProcessing(false);
      alert(`Booking Success! Reference: ${newBooking.id}`);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="pt-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-12 shadow-2xl border border-gold/10">
              <h2 className="text-3xl font-serif font-bold mb-12 flex items-center gap-6 italic">
                <div className="w-12 h-0.5 bg-gold" /> STAY INFORMATION
              </h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">CHECK-IN DATE</label>
                  <input 
                    type="date" 
                    className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none transition-all" 
                    value={bookingData.checkIn}
                    onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">CHECK-OUT DATE</label>
                  <input 
                    type="date" 
                    className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none transition-all" 
                    value={bookingData.checkOut}
                    onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">ADULTS (18+)</label>
                  <select 
                    className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none cursor-pointer"
                    value={bookingData.adults}
                    onChange={e => setBookingData({...bookingData, adults: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n} className="bg-white">{n} ADULTS</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">CHILDREN</label>
                  <select 
                    className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none cursor-pointer"
                    value={bookingData.children}
                    onChange={e => setBookingData({...bookingData, children: parseInt(e.target.value)})}
                  >
                    {[0,1,2,3].map(n => <option key={n} value={n} className="bg-white">{n} CHILDREN</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 shadow-2xl border border-gold/10">
              <h2 className="text-3xl font-serif font-bold mb-12 flex items-center gap-6 italic text-obsidian">
                <div className="w-12 h-0.5 bg-gold" /> EXCLUSIVE ADD-ONS
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {ADDONS.map(addon => (
                  <label key={addon.id} className={`flex items-start gap-6 p-8 border transition-all duration-500 cursor-pointer ${bookingData.selectedAddOns.includes(addon.id) ? 'border-gold bg-gold/5 shadow-inner' : 'border-slate-50 hover:border-gold/30 hover:shadow-xl'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1.5 accent-gold w-4 h-4" 
                      checked={bookingData.selectedAddOns.includes(addon.id)}
                      onChange={(e) => {
                        const newAddons = e.target.checked 
                          ? [...bookingData.selectedAddOns, addon.id]
                          : bookingData.selectedAddOns.filter(id => id !== addon.id);
                        setBookingData({...bookingData, selectedAddOns: newAddons});
                      }}
                    />
                    <div>
                      <p className="font-bold text-obsidian text-[11px] tracking-[0.2em] uppercase mb-2">{addon.name}</p>
                      <p className="text-[10px] text-slate-400 mb-4 leading-relaxed italic">{addon.description}</p>
                      <p className="text-gold font-serif text-2xl italic font-bold">${addon.price}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-12 shadow-2xl border border-gold/10">
              <h2 className="text-3xl font-serif font-bold mb-12 flex items-center gap-6 italic text-obsidian">
                <div className="w-12 h-0.5 bg-gold" /> GUEST DETAILS
              </h2>
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">FULL NAME</label>
                    <input 
                      type="text" 
                      className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none" 
                      required
                      placeholder="e.g. ALEXANDER HAMILTON"
                      value={bookingData.guestName}
                      onChange={e => setBookingData({...bookingData, guestName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">PRIVATE EMAIL</label>
                    <input 
                      type="email" 
                      className="w-full border-b border-gold/20 bg-transparent py-4 text-sm font-bold focus:border-gold outline-none" 
                      required
                      placeholder="ALEXANDER@LUXURY.COM"
                      value={bookingData.email}
                      onChange={e => setBookingData({...bookingData, email: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  disabled={isProcessing}
                  type="submit" 
                  className={`w-full bg-obsidian text-white py-8 font-bold uppercase tracking-[0.4em] text-xs hover:bg-gold transition-all flex items-center justify-center gap-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="animate-spin w-5 h-5" /> PROCESSING...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 text-gold" /> CONFIRM & RESERVE • ${grandTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-obsidian text-white p-12 sticky top-28 border-b-8 border-gold shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)]">
              <h3 className="text-2xl font-serif font-bold mb-12 italic text-gold tracking-widest">SUMMARY</h3>
              <div className="mb-12 h-56 overflow-hidden border border-white/10 group">
                <img src={selectedRoom.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
              </div>
              <div className="space-y-8 mb-12 text-sm font-medium">
                <div className="border-b border-white/5 pb-6">
                   <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-2 italic">ACCOMMODATION</p>
                   <p className="font-serif text-2xl italic">{selectedRoom.name}</p>
                </div>
                <div className="flex justify-between items-center text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">
                  <span>STAY DURATION</span>
                  <span className="text-white">{calculation.nights} NIGHTS</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">
                  <span>ROOM TOTAL</span>
                  <span className="text-white font-bold">${calculation.total.toFixed(2)}</span>
                </div>
                {bookingData.selectedAddOns.length > 0 && (
                   <div className="flex justify-between items-center text-slate-400 uppercase tracking-[0.3em] text-[10px] font-bold">
                    <span>EXCLUSIVE EXTRAS</span>
                    <span className="text-gold font-bold">${addOnTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-10 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-gold font-serif text-2xl italic tracking-widest">TOTAL</span>
                  <span className="text-4xl font-serif font-bold text-white">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-white/5 p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 text-gold opacity-10 group-hover:opacity-100 transition-opacity">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase tracking-[0.3em]">
                  GUARANTEED PRIVACY. YOUR PREMIER RESERVATION IS PROTECTED WITH OUR TOP-TIER SECURITY INFRASTRUCTURE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ExperiencesPage = () => {
  return (
    <div className="pt-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="text-center mb-24">
          <GoldDivider />
          <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-4">DISCOVER DHIFFUSHI</p>
          <h1 className="text-6xl font-serif font-bold text-obsidian italic uppercase">Island Adventures</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {EXPERIENCES.map((exp) => (
            <div key={exp.title} className="group cursor-pointer bg-white overflow-hidden shadow-2xl transition-all duration-700">
              <div className="relative h-[450px] overflow-hidden">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/40 to-transparent" />
                <div className="absolute bottom-12 left-10 right-10 text-white">
                   <StarRating count={5} />
                  <h3 className="text-3xl font-serif font-bold mt-4 mb-4 italic group-hover:text-gold transition-colors tracking-tight">{exp.title}</h3>
                  <p className="text-[10px] opacity-70 team-relaxed font-bold uppercase tracking-[0.3em] line-clamp-2">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ContactPage = () => {
  const { cms } = useStore();
  return (
    <div className="pt-24 bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="grid md:grid-cols-2 gap-28 items-start">
          <div>
            <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-6">PRIVATE INQUIRIES</p>
            <h1 className="text-7xl font-serif font-bold text-obsidian italic mb-16 leading-tight">Let's Connect</h1>
            
            <div className="space-y-16">
              <div className="flex gap-8 group">
                <div className="bg-obsidian p-6 h-fit border-b-2 border-gold group-hover:translate-x-2 transition-transform shadow-xl">
                  <Phone className="text-gold w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold italic mb-3">WhatsApp & Private Line</h4>
                  <p className="text-slate-500 font-bold text-sm tracking-widest">{cms.contactPhone}</p>
                  <p className="text-gold font-bold text-[10px] tracking-[0.4em] uppercase mt-2">{cms.whatsapp}</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="bg-obsidian p-6 h-fit border-b-2 border-gold group-hover:translate-x-2 transition-transform shadow-xl">
                  <Mail className="text-gold w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold italic mb-3">Email Concierge</h4>
                  <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">{cms.contactEmail}</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <div className="bg-obsidian p-6 h-fit border-b-2 border-gold group-hover:translate-x-2 transition-transform shadow-xl">
                  <MapPin className="text-gold w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-bold italic mb-3">Resort Location</h4>
                  <p className="text-slate-500 font-bold text-[11px] tracking-[0.3em] uppercase leading-relaxed">
                    DHIFFUSHI ISLAND, NORTH MALE ATOLL<br />
                    REPUBLIC OF MALDIVES
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-16 shadow-2xl border border-gold/10 relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pattern opacity-10" />
            <h3 className="text-3xl font-serif font-bold mb-12 italic border-b border-gold/20 pb-6">Direct Inquiry</h3>
            <form className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[9px] font-bold text-gold uppercase tracking-[0.3em] mb-4">GUEST NAME</label>
                  <input type="text" className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" placeholder="ALEXANDER" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gold uppercase tracking-[0.3em] mb-4">EMAIL ADDRESS</label>
                  <input type="email" className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" placeholder="ALEX@EMAIL.COM" />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-gold uppercase tracking-[0.3em] mb-4">HOW CAN WE ASSIST YOU?</label>
                <textarea className="w-full border-b border-gold/20 bg-transparent h-44 py-4 text-xs font-bold focus:border-gold outline-none resize-none" placeholder="DESCRIBE YOUR PLANS..."></textarea>
              </div>
              <button className="w-full bg-obsidian text-white py-6 font-bold uppercase tracking-[0.5em] text-[10px] hover:bg-gold transition-all shadow-2xl">
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- ADMIN PAGES ---
// (Simplified Admin Views using the same premium color palette)

const AdminDashboard = () => {
  const { bookings, rooms } = useStore();
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-3">ADMINISTRATION</p>
            <h1 className="text-5xl font-serif font-bold text-obsidian italic">Property Analytics</h1>
          </div>
          <div className="bg-obsidian px-6 py-3 border-b-2 border-gold text-[10px] font-bold text-gold tracking-widest uppercase">
            ACTIVE SESSION: {format(new Date(), 'HH:mm')}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'TOTAL REVENUE', val: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-teal-600' },
            { label: 'TOTAL BOOKINGS', val: bookings.length, icon: Briefcase, color: 'text-blue-600' },
            { label: 'EST. OCCUPANCY', val: '84%', icon: TrendingUp, color: 'text-purple-600' },
            { label: 'ARRIVALS', val: '12', icon: Users, color: 'text-orange-600' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 shadow-xl border border-gold/10 group hover:border-gold transition-all">
              <stat.icon className={`w-8 h-8 mb-6 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-3xl font-serif font-bold text-obsidian">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white shadow-2xl border border-gold/10 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-serif text-2xl italic font-bold">Live Reservations</h3>
              <Link to="/admin/bookings" className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Full Report</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">GUEST</th>
                    <th className="px-8 py-5">STAY</th>
                    <th className="px-8 py-5">REVENUE</th>
                    <th className="px-8 py-5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-obsidian text-sm tracking-tight">{b.guestName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono tracking-tighter">{b.id}</p>
                      </td>
                      <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase">
                        {format(new Date(b.checkIn), 'MMM d')} - {format(new Date(b.checkOut), 'MMM d')}
                      </td>
                      <td className="px-8 py-6 font-serif font-bold text-obsidian text-lg">
                        ${b.totalAmount.toFixed(0)}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white shadow-2xl border border-gold/10 p-10">
            <h3 className="font-serif text-2xl italic font-bold mb-10">Inventory Status</h3>
            <div className="space-y-12">
              {rooms.map(r => (
                <div key={r.id} className="group">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[11px] font-bold text-obsidian uppercase tracking-widest">{r.name}</p>
                    <p className="text-[11px] font-bold text-gold uppercase tracking-widest">{r.totalRooms} UNITS</p>
                  </div>
                  <div className="w-full h-1 bg-slate-50 overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all duration-1000 group-hover:scale-x-105 origin-left" 
                      style={{ width: `${Math.min(100, (r.totalRooms / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminRooms = () => {
  const { rooms, addRoom, deleteRoom } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: RoomType.DELUXE,
    maxOccupancy: 2,
    description: '',
    amenities: '',
    baseRate: 100,
    totalRooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      name: newRoom.name,
      type: newRoom.type,
      maxOccupancy: newRoom.maxOccupancy,
      description: newRoom.description,
      amenities: newRoom.amenities.split(',').map(a => a.trim()),
      images: [newRoom.imageUrl],
      baseRate: newRoom.baseRate,
      totalRooms: newRoom.totalRooms
    };
    addRoom(room);
    setIsAdding(false);
    setNewRoom({
      name: '',
      type: RoomType.DELUXE,
      maxOccupancy: 2,
      description: '',
      amenities: '',
      baseRate: 100,
      totalRooms: 1,
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800'
    });
  };

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-3">INVENTORY</p>
            <h1 className="text-5xl font-serif font-bold text-obsidian italic">Manage Rooms</h1>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-3 bg-obsidian text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gold transition-all shadow-xl border-b-2 border-gold"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "CANCEL" : "NEW ROOM TYPE"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white shadow-2xl border border-gold/10 p-12 mb-16 animate-in slide-in-from-top duration-500">
            <h3 className="text-3xl font-serif font-bold mb-10 italic">Create Sanctuary</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">ROOM NAME</label>
                <input required className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">CATEGORY</label>
                <select className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none appearance-none" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value as RoomType})}>
                  {Object.values(RoomType).map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">DESCRIPTION</label>
                <textarea className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none h-24 resize-none" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">AMENITIES (COMMA SEPARATED)</label>
                <input className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={newRoom.amenities} onChange={e => setNewRoom({...newRoom, amenities: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">IMAGE URL</label>
                <input className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={newRoom.imageUrl} onChange={e => setNewRoom({...newRoom, imageUrl: e.target.value})} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">BASE RATE ($)</label>
                <input type="number" className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={newRoom.baseRate} onChange={e => setNewRoom({...newRoom, baseRate: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-3">TOTAL UNITS</label>
                <input type="number" className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={newRoom.totalRooms} onChange={e => setNewRoom({...newRoom, totalRooms: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-2 pt-6">
                <button type="submit" className="w-full bg-obsidian text-white py-6 font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-gold transition-all shadow-xl">
                  SAVE NEW ROOM TYPE
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {rooms.map(room => (
            <div key={room.id} className="bg-white shadow-2xl border border-gold/10 overflow-hidden flex flex-col sm:flex-row group transition-all hover:scale-[1.02]">
              <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                <img src={room.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                <button 
                  onClick={() => { if(confirm('Are you sure? This cannot be undone.')) deleteRoom(room.id); }}
                  className="absolute top-4 left-4 bg-obsidian/80 backdrop-blur p-3 rounded-full text-gold hover:bg-red-600 hover:text-white transition-all shadow-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-10 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold italic px-2 py-0.5 border border-gold/20">{room.type}</span>
                    <span className="text-lg font-serif font-bold text-obsidian italic">${room.baseRate}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-4 italic text-obsidian tracking-tight">{room.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2 italic">{room.description}</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">GUESTS: {room.maxOccupancy}</span>
                  <span className="text-[9px] font-bold text-obsidian uppercase tracking-widest">UNITS: {room.totalRooms}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminCMS = () => {
  const { cms, updateCMS } = useStore();
  const [formData, setFormData] = useState(cms);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCMS(formData);
    alert('Visual Identity Updated!');
  };

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-3">IDENTITY</p>
          <h1 className="text-5xl font-serif font-bold text-obsidian italic">Visual Content</h1>
        </div>
        <div className="bg-white shadow-2xl border border-gold/10 p-16">
          <form onSubmit={handleSave} className="space-y-16">
            <section>
              <h3 className="text-2xl font-serif font-bold mb-10 italic flex items-center gap-4 border-b border-gold/20 pb-4">
                <Palmtree className="w-6 h-6 text-gold" /> HOMEPAGE HERO
              </h3>
              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-4">PRIMARY HEADLINE</label>
                  <input className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-4">SUPPORTING TEXT</label>
                  <input className="w-full border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gold uppercase tracking-widest mb-4">CINEMATIC IMAGE URL</label>
                  <div className="flex gap-6 items-center">
                    <input className="flex-1 border-b border-gold/20 bg-transparent py-4 text-xs font-bold focus:border-gold outline-none" value={formData.heroImage} onChange={e => setFormData({...formData, heroImage: e.target.value})} />
                    <img src={formData.heroImage} className="w-20 h-16 object-cover border border-gold/20 grayscale" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-serif font-bold mb-10 italic flex items-center gap-4 border-b border-gold/20 pb-4">
                <FileText className="w-6 h-6 text-gold" /> BRAND STORY
              </h3>
              <textarea className="w-full border-b border-gold/20 bg-transparent h-40 py-4 text-xs font-bold focus:border-gold outline-none resize-none leading-relaxed" value={formData.aboutText} onChange={e => setFormData({...formData, aboutText: e.target.value})} />
            </section>

            <button type="submit" className="w-full bg-obsidian text-white py-6 font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-gold transition-all shadow-2xl">
              APPLY IDENTITY CHANGES
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminRates = () => {
  const { rates, updateRates } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newRates: RateRule[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length < 8) continue;
        newRates.push({
          roomType: parts[0] as RoomType,
          date: parts[1],
          baseRate: parseFloat(parts[2]),
          extraAdult: parseFloat(parts[3]),
          extraChild: parseFloat(parts[4]),
          minStay: parseInt(parts[5]),
          stopSell: parts[6].toLowerCase() === 'yes',
          availableRooms: parseInt(parts[7])
        });
      }
      if (newRates.length > 0) {
        updateRates(newRates);
        alert(`Successfully synchronized ${newRates.length} rules.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-3">ECONOMICS</p>
            <h1 className="text-5xl font-serif font-bold text-obsidian italic">Dynamic Pricing</h1>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-4 bg-obsidian text-white px-10 py-5 font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-gold transition-all shadow-2xl border-b-2 border-gold"
          >
            <Upload className="w-5 h-5 text-gold" /> SYNC CSV DATA
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
        </div>

        <div className="bg-white shadow-2xl border border-gold/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
              <tr>
                <th className="px-10 py-6">ROOM CATEGORY</th>
                <th className="px-10 py-6">CALENDAR DATE</th>
                <th className="px-10 py-6 text-center">BASE</th>
                <th className="px-10 py-6 text-center">EXTRAS</th>
                <th className="px-10 py-6 text-right">INVENTORY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rates.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-10 py-8 font-serif font-bold text-obsidian text-lg italic">{r.roomType}</td>
                  <td className="px-10 py-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">{r.date}</td>
                  <td className="px-10 py-8 text-center font-serif font-bold text-gold text-2xl italic">${r.baseRate}</td>
                  <td className="px-10 py-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">${r.extraAdult} / ${r.extraChild}</td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-bold text-obsidian tracking-widest">{r.availableRooms} UNITS</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${r.stopSell ? 'text-red-500' : 'text-teal-600'}`}>
                        {r.stopSell ? 'STOP SELL' : 'OPEN'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const { bookings, rooms } = useStore();
  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-gold uppercase tracking-[0.5em] font-bold text-[10px] mb-3">LEDGER</p>
          <h1 className="text-5xl font-serif font-bold text-obsidian italic">Reservation Records</h1>
        </div>
        <div className="bg-white shadow-2xl border border-gold/10 overflow-hidden">
           <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em]">
                  <tr>
                    <th className="px-10 py-6">REFERENCE</th>
                    <th className="px-10 py-6">GUEST NAME</th>
                    <th className="px-10 py-6">CALENDAR</th>
                    <th className="px-10 py-6">CATEGORY</th>
                    <th className="px-10 py-6 text-right">REVENUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-8 font-mono text-[10px] font-bold text-gold">{b.id}</td>
                      <td className="px-10 py-8">
                        <p className="font-bold text-obsidian text-sm uppercase tracking-tight">{b.guestName}</p>
                        <p className="text-[10px] text-slate-400 lowercase italic">{b.email}</p>
                      </td>
                      <td className="px-10 py-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {format(new Date(b.checkIn), 'MMM d')} - {format(new Date(b.checkOut), 'MMM d')}
                      </td>
                      <td className="px-10 py-8 text-[11px] text-slate-600 font-bold uppercase tracking-widest">
                        {rooms.find(r => r.id === b.roomId)?.name || 'LEGACY ROOM'}
                      </td>
                      <td className="px-10 py-8 text-right font-serif font-bold text-obsidian text-2xl italic">
                        ${b.totalAmount.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/cms" element={<AdminCMS />} />
        <Route path="/admin/rates" element={<AdminRates />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
