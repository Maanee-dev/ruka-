
import { differenceInDays, addDays, format } from 'date-fns';
import { Room, RateRule, RoomType } from '../types';

export const calculateStayTotal = (
  room: Room,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
  rates: RateRule[]
) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nights = differenceInDays(endDate, startDate);
  
  let total = 0;
  const breakDown: { date: string, price: number }[] = [];

  for (let i = 0; i < nights; i++) {
    const currentDate = format(addDays(startDate, i), 'yyyy-MM-dd');
    const rateRule = rates.find(r => r.date === currentDate && r.roomType === room.type);
    
    let nightlyRate = rateRule ? rateRule.baseRate : room.baseRate;
    
    // Extras logic
    const extraAdults = Math.max(0, adults - 2); // Assuming base rate covers 2 adults
    const extraChildren = children;

    if (rateRule) {
      nightlyRate += (extraAdults * rateRule.extraAdult);
      nightlyRate += (extraChildren * rateRule.extraChild);
    } else {
      // Default extra guest policy if no specific rate rule
      nightlyRate += (extraAdults * 30);
      nightlyRate += (extraChildren * 15);
    }

    total += nightlyRate;
    breakDown.push({ date: currentDate, price: nightlyRate });
  }

  return { total, nights, breakDown };
};
