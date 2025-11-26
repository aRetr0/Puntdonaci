import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDonation extends Document {
  userId: Types.ObjectId;
  appointmentId?: Types.ObjectId;
  donationType: 'sang_total' | 'plaquetes' | 'plasma' | 'medul·la';
  date: Date;
  donationCenterId: Types.ObjectId;
  donationCenterName: string;
  tokensEarned: number;
  volume?: number; // ml for blood/plasma
  notes?: string;
  createdAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    donationType: {
      type: String,
      required: true,
      enum: ['sang_total', 'plaquetes', 'plasma', 'medul·la'],
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    donationCenterId: {
      type: Schema.Types.ObjectId,
      ref: 'DonationCenter',
      required: true,
    },
    donationCenterName: {
      type: String,
      required: true,
    },
    tokensEarned: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for user donation history
DonationSchema.index({ userId: 1, date: -1 });

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);
