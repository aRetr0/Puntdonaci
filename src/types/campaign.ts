import { BloodType, DonationType } from './index';

export type CampaignStatus = 'active' | 'upcoming' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  targetDonations: number;
  currentDonations: number;
  targetBloodTypes?: BloodType[];
  targetDonationType?: DonationType;
  priority: 'urgent' | 'high' | 'normal';
  bonusTokens?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDetail extends Campaign {
  longDescription: string;
  requirements: string[];
  benefits: string[];
  participatingCenters: string[];
  testimonials?: Testimonial[];
}

export interface Testimonial {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar?: string;
}

export interface CampaignParticipation {
  userId: string;
  campaignId: string;
  donationId: string;
  participatedAt: string;
  tokensEarned: number;
}
