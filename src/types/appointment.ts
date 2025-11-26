export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export type DonationType = 'sang_total' | 'plaquetes' | 'plasma' | 'medul·la';

export interface Appointment {
  id: string;
  userId: string;
  donationCenterId: string;
  donationType: DonationType;
  date: string; // ISO date string
  time: string; // HH:mm format
  status: AppointmentStatus;
  confirmationCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentWithDetails extends Appointment {
  donationCenter: DonationCenter;
  donationTypeDetails: DonationTypeInfo;
}

export interface DonationCenter {
  id?: string;
  _id?: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'fix' | 'mobile';
  openNow: boolean;
  schedule: Schedule[];
  phone: string;
  facilities: string[];
  imageUrl?: string;
}

export interface Schedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isClosed: boolean;
}

export interface DonationTypeInfo {
  id: DonationType;
  name: string;
  description: string;
  duration: string;
  tokens: number;
  requirements: string[];
  process: string[];
  imageUrl?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

export interface AvailabilityQuery {
  donationCenterId: string;
  donationType: DonationType;
  date: string;
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

export interface CreateAppointmentRequest {
  donationCenterId: string;
  donationType: DonationType;
  date: string;
  time: string;
  notes?: string;
}

export interface CreateAppointmentResponse {
  success: boolean;
  appointment: AppointmentWithDetails;
  message?: string;
}
