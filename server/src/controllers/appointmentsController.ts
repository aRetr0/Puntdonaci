import { Request, Response, NextFunction } from 'express';
import { Appointment, DonationCenter } from '../models';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticationError, NotFoundError, ValidationError } from '../utils/errors';

/**
 * Get all appointments for the current user
 */
export async function getAppointments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const { status } = req.query;
    const query: Record<string, unknown> = { userId: req.user.userId };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('donationCenterId')
      .sort({ date: -1 });

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific appointment
 */
export async function getAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).populate('donationCenterId');

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const { donationCenterId, donationType, date, time, notes } = req.body;

    // Verify donation center exists
    const center = await DonationCenter.findById(donationCenterId);
    if (!center) {
      throw new NotFoundError('Donation center not found');
    }

    // Check if time slot is available
    const appointmentDate = new Date(date);
    const existingAppointments = await Appointment.countDocuments({
      donationCenterId,
      date: appointmentDate,
      time,
      status: { $in: ['scheduled', 'confirmed'] },
    });

    if (existingAppointments >= center.capacity) {
      throw new ValidationError('Time slot is full', 'time');
    }

    // Create appointment
    const appointment = new Appointment({
      userId: req.user.userId,
      donationCenterId,
      donationType,
      date: appointmentDate,
      time,
      notes,
      status: 'confirmed',
    });

    await appointment.save();

    // Populate center data
    await appointment.populate('donationCenterId');

    sendCreated(
      res,
      {
        success: true,
        appointment,
        message: 'Appointment created successfully',
      },
      'Appointment created'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AuthenticationError('Not authenticated');
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      throw new ValidationError('Cannot cancel this appointment', 'status');
    }

    appointment.status = 'cancelled';
    if (req.body.reason) {
      appointment.notes = `Cancelled: ${req.body.reason}`;
    }

    await appointment.save();

    sendSuccess(res, appointment, 'Appointment cancelled');
  } catch (error) {
    next(error);
  }
}

/**
 * Check availability for a specific date and center
 */
export async function checkAvailability(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { donationCenterId, donationType, date } = req.query;

    if (!donationCenterId || !date) {
      throw new ValidationError('Missing required parameters');
    }

    const center = await DonationCenter.findById(donationCenterId as string);
    if (!center) {
      throw new NotFoundError('Donation center not found');
    }

    const appointmentDate = new Date(date as string);

    // Generate time slots (9:00 - 18:00, 30-minute intervals)
    const timeSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Count existing appointments for this time slot
        const bookedCount = await Appointment.countDocuments({
          donationCenterId,
          date: appointmentDate,
          time,
          status: { $in: ['scheduled', 'confirmed'] },
        });

        timeSlots.push({
          time,
          available: bookedCount < center.capacity,
          capacity: center.capacity,
          booked: bookedCount,
        });
      }
    }

    sendSuccess(res, {
      date: date as string,
      slots: timeSlots,
    });
  } catch (error) {
    next(error);
  }
}
