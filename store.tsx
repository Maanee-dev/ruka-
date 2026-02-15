
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking, RateRule, CMSContent } from './types';
import { INITIAL_ROOMS, INITIAL_CMS } from './constants';

interface AppContextType {
  rooms: Room[];
  bookings: Booking[];
  rates: RateRule[];
  cms: CMSContent;
  updateCMS: (newCms: Partial<CMSContent>) => void;
  addBooking: (booking: Booking) => void;
  updateRates: (newRates: RateRule[]) => void;
  addRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('ruka_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ruka_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [rates, setRates] = useState<RateRule[]>(() => {
    const saved = localStorage.getItem('ruka_rates');
    return saved ? JSON.parse(saved) : [];
  });

  const [cms, setCms] = useState<CMSContent>(() => {
    const saved = localStorage.getItem('ruka_cms');
    return saved ? JSON.parse(saved) : INITIAL_CMS;
  });

  useEffect(() => {
    localStorage.setItem('ruka_rooms', JSON.stringify(rooms));
    localStorage.setItem('ruka_bookings', JSON.stringify(bookings));
    localStorage.setItem('ruka_rates', JSON.stringify(rates));
    localStorage.setItem('ruka_cms', JSON.stringify(cms));
  }, [rooms, bookings, rates, cms]);

  const updateCMS = (newCms: Partial<CMSContent>) => setCms(prev => ({ ...prev, ...newCms }));
  const addBooking = (booking: Booking) => setBookings(prev => [booking, ...prev]);
  const updateRates = (newRates: RateRule[]) => setRates(prev => {
    // Merge new rates into existing or replace (simplified: replace for the specified dates)
    const filtered = prev.filter(p => !newRates.some(n => n.date === p.date && n.roomType === p.roomType));
    return [...filtered, ...newRates];
  });
  const addRoom = (room: Room) => setRooms(prev => [...prev, room]);
  const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

  return (
    <AppContext.Provider value={{ rooms, bookings, rates, cms, updateCMS, addBooking, updateRates, addRoom, deleteRoom }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useStore must be used within AppProvider');
  return context;
};
