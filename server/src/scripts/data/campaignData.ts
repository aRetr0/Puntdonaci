// Campaign data interface (without Mongoose Document methods)
interface CampaignSeedData {
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  targetDonations: number;
  currentDonations: number;
  targetBloodTypes?: ('A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-')[];
  targetDonationType?: 'sang_total' | 'plaquetes' | 'plasma' | 'medul·la';
  priority: 'urgent' | 'high' | 'normal';
  bonusTokens?: number;
  requirements: string[];
  benefits: string[];
  participatingCenters: string[];
}

/**
 * Generates campaign data with relative dates
 * @param centerIds Array of donation center IDs to link campaigns to
 * @returns Array of campaign objects ready for database insertion
 */
export function getCampaignData(centerIds: string[]): CampaignSeedData[] {
  const now = new Date();

  // Handle edge case: no centers available
  if (centerIds.length === 0) {
    console.warn('No donation centers available, campaigns will have empty participatingCenters');
  }

  // Helper to get a subset of centers
  const getCenterSubset = (maxCount: number): string[] => {
    if (centerIds.length === 0) return [];
    return centerIds.slice(0, Math.min(maxCount, centerIds.length));
  };

  return [
    // Campaign 1: Urgent Active - O- Emergency
    {
      title: 'Crida Urgent Grup 0-',
      description: 'Les reserves del grup 0- estan sota mínims. Si ets donant universal, et necessitem ara.',
      shortDescription: 'Emergència: Reserves 0- crítiques',
      longDescription: 'Estem en una situació crítica per al grup sanguini 0 Negatiu. Aquest grup és vital perquè és el donant universal i es pot utilitzar en situacions d\'emergència quan no hi ha temps de comprovar el grup del pacient. Si ets 0-, si us plau, vine a donar tan aviat com puguis. La teva sang és l\'única que pot salvar qualsevol vida en qualsevol moment.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80',
      status: 'active' as const,
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // Ends in 10 days
      targetDonations: 500,
      currentDonations: 180,
      targetBloodTypes: ['O-'],
      targetDonationType: 'sang_total' as const,
      priority: 'urgent' as const,
      bonusTokens: 100,
      requirements: ['Grup sanguini O-', 'Major de 18 anys', 'Pes mínim 50kg'],
      benefits: ['Prioritat sense cita', 'Obsequi especial', 'Pàrquing gratuït'],
      participatingCenters: getCenterSubset(5), // First 5 centers for urgent campaigns
    },

    // Campaign 2: High Priority Active - Marató de Donació
    {
      title: 'Marató de Donació de Sang',
      description: 'Uneix-te a la gran marató de donació de sang de Catalunya. El teu gest pot salvar 3 vides.',
      shortDescription: 'La gran festa de la donació a Catalunya',
      longDescription: 'La Marató de Donants de Sang de Catalunya és la campanya de donació més gran de l\'any. Durant una setmana, els principals hospitals i punts de donació s\'omplen d\'activitats, música i bon ambient per celebrar la solidaritat. Vine a donar sang i gaudeix d\'una experiència única. Necessitem aconseguir 10.000 donacions per remuntar les reserves després de les festes.',
      imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80',
      status: 'active' as const,
      startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // Started 10 days ago
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // Ends in 30 days
      targetDonations: 10000,
      currentDonations: 4532,
      targetBloodTypes: ['A+', 'A-', 'O+', 'O-', 'B+', 'B-'],
      targetDonationType: 'sang_total' as const,
      priority: 'high' as const,
      bonusTokens: 50,
      requirements: ['Major de 18 anys', 'Pes mínim 50kg', 'No estar en dejú'],
      benefits: ['Esmorzar especial', 'Samarreta exclusiva', 'Pàrquing gratuït'],
      participatingCenters: centerIds, // All centers participate
    },

    // Campaign 3: Normal Active - Summer Campaign
    {
      title: 'Campanya d\'Estiu 2025',
      description: 'A l\'estiu, les donacions baixen un 30%. Ajuda\'ns a mantenir les reserves.',
      shortDescription: 'No facis vacances de la solidaritat',
      longDescription: 'Durant els mesos d\'estiu, molta gent marxa de vacances i les donacions de sang disminueixen considerablement. Però les necessitats als hospitals es mantenen. Per això, et demanem que abans de marxar, o quan tornis, vinguis a donar sang. És un moment imprescindible per garantir que tothom qui ho necessiti pugui rebre sang.',
      imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80',
      status: 'active' as const,
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Started 5 days ago
      endDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), // Ends in 60 days
      targetDonations: 5000,
      currentDonations: 856,
      priority: 'normal' as const,
      bonusTokens: 25,
      requirements: ['Major de 18 anys', 'Pes mínim 50kg'],
      benefits: ['Gelat gratuït', 'Barret de palla', 'Aigua fresca'],
      participatingCenters: getCenterSubset(15), // First 15 centers
    },

    // Campaign 4: Upcoming - Back to School
    {
      title: 'Tornada a l\'Escola Solidària',
      description: 'Comença el curs donant sang. Ajuda\'ns a preparar les reserves per a la tardor.',
      shortDescription: 'Donació solidària de setembre',
      longDescription: 'Amb la tornada a l\'escola i les vacances acabant, és el moment perfecte per pensar en els altres. Començar el curs fent una donació de sang és una manera meravellosa de tornar a la rutina amb un acte solidari. A més, rebràs material escolar de regal per als més petits de casa.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80',
      status: 'upcoming' as const,
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // Starts in 15 days
      endDate: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000), // Ends in 75 days
      targetDonations: 3000,
      currentDonations: 0,
      priority: 'normal' as const,
      bonusTokens: 30,
      requirements: ['Major de 18 anys', 'Pes mínim 50kg'],
      benefits: ['Material escolar de regal', 'Descompte en llibreries', 'Motxilla sostenible'],
      participatingCenters: getCenterSubset(10), // First 10 centers
    },

    // Campaign 5: Recently Completed - Spring Campaign
    {
      title: 'Primavera de Vida',
      description: 'Campanya de primavera completada amb èxit. Gràcies a tots els participants!',
      shortDescription: 'Primavera 2025 - Completada',
      longDescription: 'La campanya de primavera ha estat un èxit rotund gràcies a la vostra solidaritat. Hem superat l\'objectiu inicial i hem aconseguit 2.145 donacions quan l\'objectiu era de 2.000. Gràcies a tots els donants que heu participat. La vostra generositat ha salvat moltes vides.',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80',
      status: 'completed' as const,
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // Started 90 days ago
      endDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Ended 15 days ago
      targetDonations: 2000,
      currentDonations: 2145, // Exceeded target
      priority: 'normal' as const,
      bonusTokens: 20,
      requirements: ['Major de 18 anys', 'Pes mínim 50kg'],
      benefits: ['Planta de regal', 'Samarreta primavera', 'Tassa commemorativa'],
      participatingCenters: getCenterSubset(8), // First 8 centers
    },
  ];
}
