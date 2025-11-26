import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  userId: Types.ObjectId;
  donationCenterId: Types.ObjectId;
  donationType: 'sang_total' | 'plaquetes' | 'plasma' | 'medul·la';
  date: Date;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  confirmationCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    donationCenterId: {
      type: Schema.Types.ObjectId,
      ref: 'DonationCenter',
      required: true,
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
    time: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'],
    },
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    confirmationCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Generate confirmation code before saving
AppointmentSchema.pre('save', function (next) {
  if (!this.confirmationCode && this.status === 'confirmed') {
    this.confirmationCode = `APT${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;
  }
  next();
});

// Compound index for checking availability
AppointmentSchema.index({ donationCenterId: 1, date: 1, time: 1 });

// Index for querying user appointments
AppointmentSchema.index({ userId: 1, date: -1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
