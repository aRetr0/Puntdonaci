// User types
export * from './user';

// Appointment types
export * from './appointment';

// Donation types
export * from './donation';

// Campaign types
export * from './campaign';

// Reward types
export * from './reward';

// API types
export * from './api';

// Common types
export type TabType = 'home' | 'calendari' | 'recompenses' | 'perfil';

export type ViewType = 'welcome' | 'login' | 'signup' | 'signupStep2';

export type RequestStep = 'type' | 'location' | 'date' | 'time' | 'confirm';
