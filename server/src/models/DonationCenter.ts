import mongoose, { Schema, Document } from 'mongoose';

interface ISchedule {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isClosed: boolean;
}

export interface IDonationCenter extends Document {
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
  schedule: ISchedule[];
  phone: string;
  facilities: string[];
  imageUrl?: string;
  capacity: number; // Max appointments per time slot
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },
    openTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    closeTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const DonationCenterSchema = new Schema<IDonationCenter>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },
    type: {
      type: String,
      required: true,
      enum: ['fix', 'mobile'],
    },
    openNow: {
      type: Boolean,
      default: true,
    },
    schedule: [ScheduleSchema],
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
      default: 4,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for nearby searches
DonationCenterSchema.index({ coordinates: '2dsphere' });

export const DonationCenter = mongoose.model<IDonationCenter>(
  'DonationCenter',
  DonationCenterSchema
);
