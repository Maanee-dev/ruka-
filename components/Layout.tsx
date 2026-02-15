import React, { useState, useEffect } from 'react';
// Use namespace import and destructuring to resolve potential environment/type export issues
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../store';
import { Menu, X, Waves, Settings, Home, Calendar, LayoutDashboard, FileText, BarChart3, Briefcase } from 'lucide-react';

const { Link, useLocation } = ReactRouterDOM as any;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const guestLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ROOMS', href: '/rooms' },
    { name: 'EXPERIENCES', href: '/experiences' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const adminLinks = [
    { name: 'DASHBOARD', href: '/admin', icon: LayoutDashboard },
    { name: 'MANAGE ROOMS', href: '/admin/rooms', icon: Briefcase },
    { name: 'ROOM RATES', href: '/admin/rates', icon: BarChart3 },
    { name: 'BOOKINGS', href: '/admin/bookings', icon: Calendar },
    { name: 'CONTENT CMS', href: '/admin/cms', icon: FileText },
  ];

  const links = isAdmin ? adminLinks : guestLinks;
  const isHomePage = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-obsidian py-3 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className={`p-2 rounded-full border border-gold/30 transition-all duration-500 ${scrolled ? 'scale-90' : ''}`}>
              <Waves className="w-6 h-6 text-gold" />
            </div>
            <span className="text-xl font-serif font-bold tracking-[0.2em] text-white">
              RUKA <span className="text-gold">MALDIVES</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[10px] font-bold tracking-[0.3em] transition-all hover:text-gold ${
                  location.pathname === link.href ? 'text-gold' : 'text-white/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={isAdmin ? "/" : "/admin"}
              className="bg-gold hover:bg-gold-hover text-white text-[10px] font-bold tracking-[0.2em] px-6 py-3 transition-all"
            >
              {isAdmin ? "GO TO WEBSITE" : "STAFF PORTAL"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gold p-2">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-obsidian border-b border-gold/20 animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-4 pb-10 space-y-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-[11px] font-bold tracking-[0.3em] text-white/80 hover:text-gold transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={isAdmin ? "/" : "/admin"}
              onClick={() => setIsOpen(false)}
              className="block bg-gold text-white text-center text-[11px] font-bold tracking-[0.3em] py-4 mt-6"
            >
              {isAdmin ? "EXIT ADMIN" : "STAFF ACCESS"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
