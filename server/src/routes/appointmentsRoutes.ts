import { Router } from 'express';
import * as appointmentsController from '../controllers/appointmentsController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * GET /api/appointments/availability
 * Check availability for a specific date and center
 */
router.get('/availability', appointmentsController.checkAvailability);

/**
 * GET /api/appointments
 * Get all appointments for current user
 */
router.get('/', appointmentsController.getAppointments);

/**
 * GET /api/appointments/:id
 * Get a specific appointment
 */
router.get('/:id', appointmentsController.getAppointment);

/**
 * POST /api/appointments
 * Create a new appointment
 */
router.post('/', appointmentsController.createAppointment);

/**
 * PATCH /api/appointments/:id/cancel
 * Cancel an appointment
 */
router.patch('/:id/cancel', appointmentsController.cancelAppointment);

export default router;
