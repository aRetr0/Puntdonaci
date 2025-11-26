import { Request, Response, NextFunction } from 'express';
import { DonationCenter } from '../models';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ValidationError } from '../utils/errors';

/**
 * Get all donation centers
 */
export async function getDonationCenters(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const centers = await DonationCenter.find({ openNow: true }).sort({ name: 1 });

    sendSuccess(res, centers);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific donation center
 */
export async function getDonationCenter(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const center = await DonationCenter.findById(req.params.id);

    if (!center) {
      throw new NotFoundError('Donation center not found');
    }

    sendSuccess(res, center);
  } catch (error) {
    next(error);
  }
}

/**
 * Get donation centers near a location
 */
export async function getNearbyDonationCenters(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      throw new ValidationError('Latitude and longitude are required');
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusInMeters = radius ? parseInt(radius as string, 10) : 10000; // Default 10km

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ValidationError('Invalid coordinates');
    }

    // Find centers within radius using geospatial query
    const centers = await DonationCenter.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
      openNow: true,
    }).limit(20);

    sendSuccess(res, centers);
  } catch (error) {
    next(error);
  }
}

/**
 * Get donation type information
 */
export async function getDonationTypes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const donationTypes = [
      {
        id: 'sang_total',
        name: 'Sang Total',
        description: 'Donació de sang completa que inclou glòbuls vermells, plaquetes i plasma',
        duration: '30-45 min',
        tokens: 15,
        requirements: [
          'Edat entre 18 i 65 anys',
          'Pes mínim 50 kg',
          'Estar en bon estat de salut',
        ],
        process: [
          'Registre i questionari mèdic',
          'Prova de hemoglobina',
          'Extracció (8-10 minuts)',
          'Descans i refrigeri',
        ],
      },
      {
        id: 'plaquetes',
        name: 'Plaquetes',
        description: 'Donació específica de plaquetes mitjançant aferesi',
        duration: '90-120 min',
        tokens: 20,
        requirements: [
          'Haver donat sang prèviament',
          'Tenir un bon nombre de plaquetes',
          'Disponibilitat de temps',
        ],
        process: [
          'Avaluació prèvia',
          'Connexió a màquina d\'aferesi',
          'Separació de plaquetes',
          'Retorn de la resta de components',
        ],
      },
      {
        id: 'plasma',
        name: 'Plasma',
        description: 'Donació de la part líquida de la sang',
        duration: '45-60 min',
        tokens: 18,
        requirements: [
          'Edat entre 18 i 65 anys',
          'Pes mínim 50 kg',
          'No haver donat plasma en els últims 15 dies',
        ],
        process: [
          'Preparació i proves',
          'Extracció mitjançant plasmafèresi',
          'Separació del plasma',
          'Descans',
        ],
      },
      {
        id: 'medul·la',
        name: 'Medul·la Òssia',
        description: 'Registre com a donant de medul·la òssia',
        duration: 'Variable',
        tokens: 50,
        requirements: [
          'Edat entre 18 i 40 anys',
          'Estar en perfecte estat de salut',
          'Compromís a llarg termini',
        ],
        process: [
          'Registre al REDMO',
          'Prova de compatibilitat',
          'Si hi ha coincidència: extracció',
          'Seguiment post-donació',
        ],
      },
    ];

    sendSuccess(res, donationTypes);
  } catch (error) {
    next(error);
  }
}
