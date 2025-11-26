export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'home' | 'dona' | 'altre' | 'no-especificar';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  birthdate: string; // ISO date string
  gender: Gender;
  bloodType: BloodType;
  hasDonatedBefore: boolean;
  tokens: number;
  donationCount: number;
  livesSaved: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  achievements: Achievement[];
  donationHistory: Donation[];
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isLocked: boolean;
}

export interface NotificationSettings {
  appointmentReminders: boolean;
  campaignUpdates: boolean;
  rewardAlerts: boolean;
  systemNotifications: boolean;
}

export interface PrivacySettings {
  shareImpact: boolean;
  showInLeaderboard: boolean;
  dataCollection: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthdate: string;
  gender: Gender;
  bloodType: BloodType;
  hasDonatedBefore: boolean;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface AuthError {
  success: false;
  error: string;
  field?: string;
}
