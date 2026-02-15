
import React, { useState, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Waves, Calendar, MapPin, Phone, Mail, Instagram, 
  LayoutDashboard, FileText, BarChart3, Settings,
  Users, CheckCircle2, Plus, Trash2, Upload, X,
  DollarSign, ArrowRight, ShieldCheck, TrendingUp, Briefcase, 
  MessageSquare, Star, Sun, Anchor, Palmtree, Download, AlertCircle,
  Clock, CreditCard
} from 'lucide-react';
import { format, addDays, parseISO } from 'date-fns';
import { AppProvider, useStore } from './store';
import { Navbar } from './components/Layout';
import { EXPERIENCES, ADDONS } from './constants';
import { RoomType, Room, Booking, RateRule } from './types';
import { calculateStayTotal } from './utils/rateCalculator';

// --- SHARED COMPONENTS ---

const Footer = () => {
  const { cms } = useStore();
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-2">
            <Link to="/" className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <Waves className="w-8 h-8 text-teal-500" />
              <span className="text-2xl font-bold tracking-tight text-white">RUKA <span className="text-teal-500">MALDIVES</span></span>
            </Link>
            <p className="text-slate-400 max-w-sm mx-auto md:mx-0 mb-8 leading-relaxed">
              A boutique guest house on Dhiffushi Island, bringing you the true essence of Maldivian hospitality through personalized experiences.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-teal-600 transition-colors"><MessageSquare className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link to="/rooms" className="hover:text-teal-500 transition-colors">Our Rooms</Link></li>
              <li><Link to="/experiences" className="hover:text-teal-500 transition-colors">Experiences</Link></li>
              <li><Link to="/contact" className="hover:text-teal-500 transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-teal-500 transition-colors">Staff Access</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center justify-center md:justify-start gap-2"><Mail className="w-4 h-4" /> {cms.contactEmail}</li>
              <li className="flex items-center justify-center md:justify-start gap-2"><Phone className="w-4 h-4" /> {cms.contactPhone}</li>
              <li className="flex items-center justify-center md:justify-start gap-2"><MapPin className="w-4 h-4" /> Dhiffushi, Maldives</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} Ruka Maldives Guest House.
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
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <img src={cms.heroImage} alt="Maldives" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">{cms.heroTitle}</h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">{cms.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rooms" className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-teal-600/20">
              Check Availability
            </Link>
            <Link to="/experiences" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold transition-all">
              Discover Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Private Sanctuary</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Luxury rooms designed to immerse you in the natural beauty of Dhiffushi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map(room => (
              <div key={room.id} className="group cursor-pointer" onClick={() => navigate(`/book?roomId=${room.id}`)}>
                <div className="relative h-96 rounded-3xl overflow-hidden mb-6">
                  <img src={room.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {room.type}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
                <p className="text-slate-500 mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center justify-between">
                   <p className="text-xl font-bold text-teal-600">${room.baseRate}<span className="text-sm font-normal text-slate-400"> / night</span></p>
                   <span className="flex items-center text-teal-600 font-bold group-hover:translate-x-1 transition-transform">Book <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all">
                <Sun className="w-10 h-10 text-teal-600 mb-4" />
                <h4 className="font-bold mb-2">Tropical Paradise</h4>
                <p className="text-xs text-slate-500">Unending sunshine and pristine white beaches.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all translate-y-8">
                <Anchor className="w-10 h-10 text-teal-600 mb-4" />
                <h4 className="font-bold mb-2">Expert Guides</h4>
                <p className="text-xs text-slate-500">Local experts for diving and sandbank trips.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all -translate-y-4">
                <Palmtree className="w-10 h-10 text-teal-600 mb-4" />
                <h4 className="font-bold mb-2">Authentic Vibe</h4>
                <p className="text-xs text-slate-500">Traditional Maldivian hospitality at its best.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all translate-y-4">
                <ShieldCheck className="w-10 h-10 text-teal-600 mb-4" />
                <h4 className="font-bold mb-2">Eco Conscious</h4>
                <p className="text-xs text-slate-500">Sustainable practices to protect our reefs.</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-8 italic">Why Ruka Maldives?</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {cms.aboutText}
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-teal-600" /> Private beach access points</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-teal-600" /> In-house diving center</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="text-teal-600" /> Farm-to-table dining experiences</li>
              </ul>
              <Link to="/contact" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Guest Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="p-8 bg-slate-50 rounded-3xl text-left">
                <div className="flex gap-1 mb-4 text-orange-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-600 mb-6 italic italic">"An unforgettable stay! The team at Ruka made us feel like family. The sandbank trip was the highlight of our honeymoon."</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full" />
                  <div>
                    <p className="font-bold">Sarah & Tom</p>
                    <p className="text-xs text-slate-400">United Kingdom</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const RoomsPage = () => {
  const { rooms } = useStore();
  return (
    <div className="pt-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-4">Our Sanctuaries</h1>
        <p className="text-slate-600 text-xl mb-12">Elegantly designed spaces reflecting the serene beauty of Dhiffushi.</p>
        
        <div className="grid gap-12">
          {rooms.map((room, idx) => (
            <div key={room.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2 h-[450px]">
                <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-teal-600 font-bold tracking-widest text-sm uppercase mb-4">{room.type}</span>
                <h2 className="text-3xl font-bold mb-6">{room.name}</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">{room.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {room.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-teal-500" /> {a}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                  <div>
                    <span className="text-slate-400 text-sm">Base Rate</span>
                    <p className="text-3xl font-bold text-slate-900">${room.baseRate}<span className="text-lg font-normal text-slate-400">/night</span></p>
                  </div>
                  <Link to={`/book?roomId=${room.id}`} className="bg-teal-600 text-white px-10 py-4 rounded-full font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                    Book This Room
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
    // Simulate payment gateway delay
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
    <div className="pt-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Calendar className="text-teal-600" />
                Your Stay Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Check-in</label>
                  <input 
                    type="date" 
                    className="w-full border-slate-200 rounded-xl p-3" 
                    value={bookingData.checkIn}
                    onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Check-out</label>
                  <input 
                    type="date" 
                    className="w-full border-slate-200 rounded-xl p-3" 
                    value={bookingData.checkOut}
                    onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Adults</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={selectedRoom.maxOccupancy}
                    className="w-full border-slate-200 rounded-xl p-3" 
                    value={bookingData.adults}
                    onChange={e => setBookingData({...bookingData, adults: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Children</label>
                  <input 
                    type="number" 
                    min="0" 
                    className="w-full border-slate-200 rounded-xl p-3" 
                    value={bookingData.children}
                    onChange={e => setBookingData({...bookingData, children: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Plus className="text-teal-600" />
                Optional Add-ons
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {ADDONS.map(addon => (
                  <label key={addon.id} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${bookingData.selectedAddOns.includes(addon.id) ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100 hover:border-teal-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 text-teal-600 rounded" 
                      checked={bookingData.selectedAddOns.includes(addon.id)}
                      onChange={(e) => {
                        const newAddons = e.target.checked 
                          ? [...bookingData.selectedAddOns, addon.id]
                          : bookingData.selectedAddOns.filter(id => id !== addon.id);
                        setBookingData({...bookingData, selectedAddOns: newAddons});
                      }}
                    />
                    <div>
                      <p className="font-bold text-slate-800">{addon.name}</p>
                      <p className="text-xs text-slate-500 mb-2">{addon.description}</p>
                      <p className="text-teal-600 font-bold">${addon.price} <span className="text-[10px] text-slate-400 font-normal uppercase">{addon.type} / {addon.frequency}</span></p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <Users className="text-teal-600" />
                Contact Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Guest Name</label>
                    <input 
                      type="text" 
                      className="w-full border-slate-200 rounded-xl p-3" 
                      required
                      placeholder="Jane Doe"
                      value={bookingData.guestName}
                      onChange={e => setBookingData({...bookingData, guestName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full border-slate-200 rounded-xl p-3" 
                      required
                      placeholder="jane@example.com"
                      value={bookingData.email}
                      onChange={e => setBookingData({...bookingData, email: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  disabled={isProcessing}
                  type="submit" 
                  className={`w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="animate-spin" /> Processing Secure Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" /> Confirm & Pay • ${grandTotal.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Reservation Summary</h3>
              <div className="mb-6 rounded-2xl overflow-hidden h-40">
                <img src={selectedRoom.images[0]} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Room Type</p>
                    <p className="font-bold text-slate-800">{selectedRoom.name}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-500">{calculation.nights} nights</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base Stay</span>
                  <span className="font-bold text-slate-800">${calculation.total.toFixed(2)}</span>
                </div>
                {bookingData.selectedAddOns.length > 0 && (
                   <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Add-ons Total</span>
                    <span className="font-bold text-slate-800">${addOnTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-bold text-teal-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
                    100% Secure. We use end-to-end encryption for your personal and payment details.
                  </p>
                </div>
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
    <div className="pt-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-4">Island Adventures</h1>
        <p className="text-slate-600 text-xl mb-12 max-w-2xl">From turquoise depths to golden sunsets, discover the magic of Dhiffushi with our curated experiences.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIENCES.map((exp) => (
            <div key={exp.title} className="group cursor-pointer">
              <div className="relative h-96 rounded-3xl overflow-hidden mb-6">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white pr-6">
                  <h3 className="text-2xl font-bold mb-2">{exp.title}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">{exp.description}</p>
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
    <div className="pt-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-bold mb-8 italic">Let's Connect</h1>
            <p className="text-slate-600 text-xl mb-12">Plan your perfect getaway. Reach out via email, phone, or the form here.</p>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm h-fit"><Phone className="text-teal-600" /></div>
                <div>
                  <h4 className="font-bold">Phone & WhatsApp</h4>
                  <p className="text-slate-500">{cms.contactPhone}</p>
                  <p className="text-teal-600 font-medium">{cms.whatsapp}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm h-fit"><Mail className="text-teal-600" /></div>
                <div>
                  <h4 className="font-bold">Direct Email</h4>
                  <p className="text-slate-500">{cms.contactEmail}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm h-fit"><MapPin className="text-teal-600" /></div>
                <div>
                  <h4 className="font-bold">Our Location</h4>
                  <p className="text-slate-500 font-medium italic">Dhiffushi Island, Maldives</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">North Male Atoll</p>
                </div>
              </div>
            </div>
            
            {/* Mock Map */}
            <div className="mt-12 h-64 bg-slate-200 rounded-3xl overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2 font-bold">
                    <MapPin className="text-red-500" /> Ruka Maldives
                 </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold mb-8">Quick Inquiry</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input type="text" className="w-full border-slate-200 rounded-xl p-3" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full border-slate-200 rounded-xl p-3" placeholder="john@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">How can we help?</label>
                <textarea className="w-full border-slate-200 rounded-xl h-40 p-3" placeholder="Tell us about your trip plans..."></textarea>
              </div>
              <button className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                Send Message
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

const AdminDashboard = () => {
  const { bookings, rooms } = useStore();
  const totalRevenue = bookings.reduce((acc, b) => acc + b.totalAmount, 0);
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="pt-24 px-6 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Property Analytics</h1>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-500">
            Last updated: {format(new Date(), 'HH:mm')}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <DollarSign className="w-8 h-8 text-teal-600 mb-4 bg-teal-50 p-2 rounded-lg" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Briefcase className="w-8 h-8 text-blue-600 mb-4 bg-blue-50 p-2 rounded-lg" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-slate-800">{bookings.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-4 bg-purple-50 p-2 rounded-lg" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Est. Occupancy</p>
            <p className="text-3xl font-bold text-slate-800">84%</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <Users className="w-8 h-8 text-orange-600 mb-4 bg-orange-50 p-2 rounded-lg" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Upcoming Arrivals</p>
            <p className="text-3xl font-bold text-slate-800">12</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg">Live Reservations</h3>
              <Link to="/admin/bookings" className="text-teal-600 text-sm font-bold hover:underline">Full Report</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Stay</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{b.guestName}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">{b.id}</p>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {format(parseISO(b.checkIn), 'MMM d')} - {format(parseISO(b.checkOut), 'MMM d')}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        ${b.totalAmount.toFixed(0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Waiting for first booking...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-lg mb-6">Inventory Status</h3>
            <div className="space-y-8">
              {rooms.map(r => (
                <div key={r.id}>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-slate-700">{r.name}</p>
                    <p className="text-xs font-bold text-teal-600">{r.totalRooms} Units</p>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
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
    imageUrl: 'https://picsum.photos/800/600?random=' + Math.random()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room: Room = {
      id: Math.random().toString(36).substr(2, 9),
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
      imageUrl: 'https://picsum.photos/800/600?random=' + Math.random()
    });
  };

  return (
    <div className="pt-24 px-6 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Rooms</h1>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? "Cancel" : "Add Room Type"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8 animate-in slide-in-from-top duration-300">
            <h3 className="text-xl font-bold mb-6">Create New Room Type</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Room Name</label>
                <input required className="w-full border-slate-200 rounded-xl p-3" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Type Category</label>
                <select className="w-full border-slate-200 rounded-xl p-3" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value as RoomType})}>
                  {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-2">Description</label>
                <textarea className="w-full border-slate-200 rounded-xl p-3 h-24" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Amenities (comma separated)</label>
                <input className="w-full border-slate-200 rounded-xl p-3" value={newRoom.amenities} onChange={e => setNewRoom({...newRoom, amenities: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Image URL</label>
                <input className="w-full border-slate-200 rounded-xl p-3" value={newRoom.imageUrl} onChange={e => setNewRoom({...newRoom, imageUrl: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Base Rate ($)</label>
                <input type="number" className="w-full border-slate-200 rounded-xl p-3" value={newRoom.baseRate} onChange={e => setNewRoom({...newRoom, baseRate: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Inventory Count</label>
                <input type="number" className="w-full border-slate-200 rounded-xl p-3" value={newRoom.totalRooms} onChange={e => setNewRoom({...newRoom, totalRooms: parseInt(e.target.value)})} />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Save Room Type
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-1/3 h-48 sm:h-auto relative">
                <img src={room.images[0]} className="w-full h-full object-cover" />
                <button 
                  onClick={() => { if(confirm('Delete room?')) deleteRoom(room.id); }}
                  className="absolute top-2 left-2 bg-red-500/80 backdrop-blur p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{room.type}</span>
                    <span className="text-sm font-bold text-slate-700">${room.baseRate}/nt</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{room.description}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400">Capacity: {room.maxOccupancy} Guests</span>
                  <span className="text-xs font-bold text-slate-700">Stock: {room.totalRooms}</span>
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
    alert('Website Content Updated!');
  };

  return (
    <div className="pt-24 px-6 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Visual Content Manager</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <form onSubmit={handleSave} className="space-y-10">
            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <Palmtree className="w-5 h-5 text-teal-600" />
                Homepage Hero
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Main Headline</label>
                  <input className="w-full border-slate-200 rounded-xl p-3" value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Supporting Subtitle</label>
                  <input className="w-full border-slate-200 rounded-xl p-3" value={formData.heroSubtitle} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Hero Image (Direct Link)</label>
                  <div className="flex gap-4 items-center">
                    <input className="flex-1 border-slate-200 rounded-xl p-3" value={formData.heroImage} onChange={e => setFormData({...formData, heroImage: e.target.value})} />
                    <img src={formData.heroImage} className="w-16 h-12 rounded-lg object-cover border" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5 text-teal-600" />
                About Our Story
              </h3>
              <textarea className="w-full border-slate-200 rounded-xl h-32 p-3" value={formData.aboutText} onChange={e => setFormData({...formData, aboutText: e.target.value})} />
            </section>

            <section>
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">
                <Mail className="w-5 h-5 text-teal-600" />
                Support Info
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Business Email</label>
                  <input className="w-full border-slate-200 rounded-xl p-3" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Public Phone</label>
                  <input className="w-full border-slate-200 rounded-xl p-3" value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} />
                </div>
              </div>
            </section>

            <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20">
              Apply Live Changes
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
        alert(`Imported ${newRates.length} rules.`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="pt-24 px-6 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dynamic Pricing Engine</h1>
            <p className="text-slate-500">Bulk upload seasonal rates via CSV.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
            >
              <Upload className="w-4 h-4" /> Import CSV Data
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Base Rate</th>
                <th className="px-6 py-4 text-center">Extras (A/C)</th>
                <th className="px-6 py-4 text-center">Inv</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rates.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.roomType}</td>
                  <td className="px-6 py-4 text-xs font-medium">{r.date}</td>
                  <td className="px-6 py-4 text-center font-bold text-teal-600">${r.baseRate}</td>
                  <td className="px-6 py-4 text-center text-xs text-slate-500">${r.extraAdult} / ${r.extraChild}</td>
                  <td className="px-6 py-4 text-center text-xs font-bold">{r.availableRooms}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${r.stopSell ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {r.stopSell ? 'Stop Sell' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
              {rates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <BarChart3 className="w-16 h-16 mb-4" />
                       <p className="font-bold">No custom rate rules found.</p>
                    </div>
                  </td>
                </tr>
              )}
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
    <div className="pt-24 px-6 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reservation Ledger</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
           <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="px-6 py-4">Ref ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Stay Dates</th>
                    <th className="px-6 py-4">Room Category</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400">{b.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{b.guestName}</p>
                        <p className="text-xs text-slate-400">{b.email}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold">
                        {format(parseISO(b.checkIn), 'MMM d')} - {format(parseISO(b.checkOut), 'MMM d')}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {rooms.find(r => r.id === b.roomId)?.name || 'Deleted Room'}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-teal-600">
                        ${b.totalAmount.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-300">No active bookings.</td>
                    </tr>
                  )}
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
