export interface Court {
  id: string;
  name: string;
  location: string;
  availableDates: string[];
  description?: string;
  imageUrl?: string;
  openingHours?: string;
  reservationPolicy?: string;
  facilities?: string[];
  contact?: string;
  bookingUrl?: string;
}

export interface Reservation {
  id: string;
  courtId: string;
  date: string;
  timeSlot: string;
  status: 'available' | 'reserved';
} 