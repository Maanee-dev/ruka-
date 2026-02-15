
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Menu, X, Waves, Settings, Home, Calendar, LayoutDashboard, FileText, BarChart3, Briefcase } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Added icon: undefined to guestLinks to ensure consistent structure with adminLinks
  const guestLinks = [
    { name: 'Home', href: '/', icon: undefined },
    { name: 'Rooms', href: '/rooms', icon: undefined },
    { name: 'Experiences', href: '/experiences', icon: undefined },
    { name: 'Contact', href: '/contact', icon: undefined },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Rooms', href: '/admin/rooms', icon: Briefcase },
    { name: 'Room Rates', href: '/admin/rates', icon: BarChart3 },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Content CMS', href: '/admin/cms', icon: FileText },
  ];

  const links = isAdmin ? adminLinks : guestLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Waves className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold tracking-tight text-slate-800">RUKA <span className="text-teal-600">MALDIVES</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-semibold transition-colors flex items-center gap-2 ${
                  location.pathname === link.href ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.name}
              </Link>
            ))}
            <Link
              to={isAdmin ? "/" : "/admin"}
              className="ml-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600 transition-all"
              title={isAdmin ? "Go to Website" : "Admin Dashboard"}
            >
              {isAdmin ? <Home className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-base font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.name}
              </Link>
            ))}
            <Link
              to={isAdmin ? "/" : "/admin"}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-3 text-base font-bold text-teal-600 bg-teal-50 rounded-lg mt-4"
            >
              {isAdmin ? <Home className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              {isAdmin ? "Exit Admin" : "Staff Access"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
