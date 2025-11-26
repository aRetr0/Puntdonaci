import { DonationType } from './appointment';

export interface Donation {
  id: string;
  userId: string;
  appointmentId?: string;
  donationType: DonationType;
  date: string; // ISO date string
  donationCenterId: string;
  donationCenterName: string;
  tokensEarned: number;
  volume?: number; // ml for blood/plasma
  notes?: string;
  createdAt: string;
}

export interface DonationStats {
  totalDonations: number;
  livesSaved: number;
  totalTokens: number;
  donationsByType: Record<DonationType, number>;
  lastDonationDate?: string;
  nextEligibleDate?: string;
}

export interface DonationHistory {
  donations: Donation[];
  stats: DonationStats;
}

export interface MonthlyTokens {
  month: string; // YYYY-MM
  tokens: number;
}

export interface DonationEvolution {
  month: string; // YYYY-MM
  count: number;
}

export interface AnalyticsData {
  donationEvolution: DonationEvolution[];
  monthlyTokens: MonthlyTokens[];
  stats: DonationStats;
}
