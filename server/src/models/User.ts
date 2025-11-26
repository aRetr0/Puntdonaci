import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  birthdate: Date;
  gender: 'home' | 'dona' | 'altre' | 'no-especificar';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  hasDonatedBefore: boolean;
  tokens: number;
  donationCount: number;
  livesSaved: number;
  avatar?: string;
  notifications: {
    appointmentReminders: boolean;
    campaignUpdates: boolean;
    rewardAlerts: boolean;
    systemNotifications: boolean;
  };
  privacy: {
    shareImpact: boolean;
    showInLeaderboard: boolean;
    dataCollection: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['home', 'dona', 'altre', 'no-especificar'],
    },
    bloodType: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    hasDonatedBefore: {
      type: Boolean,
      required: true,
      default: false,
    },
    tokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    donationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    livesSaved: {
      type: Number,
      default: 0,
      min: 0,
    },
    avatar: {
      type: String,
    },
    notifications: {
      appointmentReminders: { type: Boolean, default: true },
      campaignUpdates: { type: Boolean, default: true },
      rewardAlerts: { type: Boolean, default: true },
      systemNotifications: { type: Boolean, default: true },
    },
    privacy: {
      shareImpact: { type: Boolean, default: true },
      showInLeaderboard: { type: Boolean, default: true },
      dataCollection: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model<IUser>('User', UserSchema);
