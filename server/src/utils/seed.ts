import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  User,
  DonationCenter,
  Campaign,
  Reward,
  Appointment,
  Donation,
} from '../models';

/**
 * Seed the database with sample data
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      DonationCenter.deleteMany({}),
      Campaign.deleteMany({}),
      Reward.deleteMany({}),
      Appointment.deleteMany({}),
      Donation.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared\n');

    // Create sample user
    console.log('👤 Creating sample users...');
    const testUser = await User.create({
      email: 'test@puntdonacio.cat',
      password: 'password123', // Will be hashed by the model
      name: 'Jordi García',
      phone: '+34 612 345 678',
      birthdate: new Date('1995-05-15'),
      gender: 'home',
      bloodType: 'O+',
      hasDonatedBefore: true,
      tokens: 45,
      donationCount: 4,
      livesSaved: 12,
    });
    console.log(`✅ Created user: ${testUser.email}\n`);

    // Create donation centers (matching frontend locations)
    console.log('🏥 Creating donation centers...');
    const centers = await DonationCenter.create([
      {
        name: 'Hospital Clínic Barcelona',
        address: 'Carrer de Villarroel, 170',
        city: 'Barcelona',
        postalCode: '08036',
        coordinates: { lat: 41.388615, lng: 2.152776 },
        type: 'fix',
        openNow: true,
        phone: '+34 932 275 400',
        facilities: ['Aparcament', 'Accés per a PMR', 'WiFi gratuït', 'Cafeteria'],
        capacity: 4,
        schedule: [
          { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 3, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 4, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 5, openTime: '08:00', closeTime: '20:00', isClosed: false },
          { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
      },
      {
        name: 'Universitat de Barcelona',
        address: 'Gran Via de les Corts Catalanes, 585',
        city: 'Barcelona',
        postalCode: '08007',
        coordinates: { lat: 41.386748, lng: 2.164512 },
        type: 'fix',
        openNow: true,
        phone: '+34 934 035 555',
        facilities: ['Accés per a PMR', 'Transport públic proper'],
        capacity: 3,
        schedule: [
          { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00', isClosed: false },
          { dayOfWeek: 5, openTime: '09:00', closeTime: '15:00', isClosed: false },
          { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
      },
      {
        name: 'Plaça Catalunya (Unitat Mòbil)',
        address: 'Plaça Catalunya',
        city: 'Barcelona',
        postalCode: '08002',
        coordinates: { lat: 41.3874, lng: 2.17 },
        type: 'mobile',
        openNow: true,
        phone: '+34 900 323 323',
        facilities: ['Unitat mòbil', 'Sense cita prèvia'],
        capacity: 2,
        schedule: [
          { dayOfWeek: 1, openTime: '10:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 3, openTime: '10:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 5, openTime: '10:00', closeTime: '14:00', isClosed: false },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 2, openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 4, openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
      },
      {
        name: 'Centre Gràcia',
        address: 'Carrer Gran de Gràcia, 200',
        city: 'Barcelona',
        postalCode: '08012',
        coordinates: { lat: 41.403706, lng: 2.158862 },
        type: 'fix',
        openNow: false,
        phone: '+34 934 151 500',
        facilities: ['Aparcament', 'Accés per a PMR', 'Cafeteria'],
        capacity: 3,
        schedule: [
          { dayOfWeek: 1, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 2, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 3, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 4, openTime: '09:00', closeTime: '19:00', isClosed: false },
          { dayOfWeek: 5, openTime: '09:00', closeTime: '15:00', isClosed: false },
          { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
      },
    ]);
    console.log(`✅ Created ${centers.length} donation centers\n`);

    // Create campaigns
    console.log('📢 Creating campaigns...');
    const campaigns = await Campaign.create([
      {
        title: 'Campanya Sant Jordi 2025',
        description:
          'Campanya especial pel Dia de Sant Jordi. Ajuda\'ns a arribar a 500 donacions!',
        shortDescription: 'Campanya especial Sant Jordi - Objectiu: 500 donacions',
        longDescription:
          'Aquest Sant Jordi, el Banc de Sang necessita la teva ajuda per assolir 500 donacions. Cada donació pot salvar fins a 3 vides. Participa i guanya 5 tokens extra!',
        imageUrl: '/images/campaigns/sant-jordi.jpg',
        status: 'active',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-04-30'),
        targetDonations: 500,
        currentDonations: 365,
        priority: 'high',
        bonusTokens: 5,
        requirements: [
          'Estar en bon estat de salut',
          'No haver donat en els últims 2 mesos',
        ],
        benefits: ['5 tokens extra', 'Rosa de regal', 'Entrada al sorteig d\'un llibre'],
        participatingCenters: centers.slice(0, 3).map((c) => c._id.toString()),
      },
      {
        title: 'Urgent: Sang O- Necessària',
        description: 'Necessitem donants de sang O- amb urgència per cobrir la demanda actual',
        shortDescription: 'Urgent: Necessitem donants O-',
        longDescription:
          'La demanda de sang O- és crítica. Si tens aquest grup sanguini, la teva donació és especialment valuosa. Participa i ajuda a salvar vides!',
        imageUrl: '/images/campaigns/urgent-o-negative.jpg',
        status: 'active',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        targetDonations: 200,
        currentDonations: 68,
        targetBloodTypes: ['O-'],
        priority: 'urgent',
        bonusTokens: 10,
        requirements: ['Tenir grup sanguini O-', 'Complir requisits generals de donació'],
        benefits: [
          '10 tokens extra',
          'Prioritat en cita',
          'Reconeixement especial al perfil',
        ],
        participatingCenters: centers.map((c) => c._id.toString()),
      },
      {
        title: 'Marató de Plaquetes Estiu',
        description: 'Campanya especial per augmentar les reserves de plaquetes durant l\'estiu',
        shortDescription: 'Marató de plaquetes - Estiu 2025',
        longDescription:
          'Durant l\'estiu, les reserves de plaquetes solen baixar. Ajuda\'ns a mantenir les reserves amb la teva donació de plaquetes.',
        imageUrl: '/images/campaigns/summer-platelets.jpg',
        status: 'upcoming',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        targetDonations: 300,
        currentDonations: 0,
        targetDonationType: 'plaquetes',
        priority: 'normal',
        bonusTokens: 8,
        requirements: [
          'Haver donat sang prèviament',
          'Disponibilitat de 2 hores',
          'Bon recompte de plaquetes',
        ],
        benefits: ['8 tokens extra', 'Esmorzar gratuït', 'Kit de playa de regal'],
        participatingCenters: [centers[0]?._id.toString() || '', centers[1]?._id.toString() || ''],
      },
    ]);
    console.log(`✅ Created ${campaigns.length} campaigns\n`);

    // Create rewards
    console.log('🎁 Creating rewards...');
    const rewards = await Reward.create([
      {
        title: 'Primavera Sound 2025',
        description: 'Entrada general per al festival Primavera Sound 2025',
        shortDescription: 'Festival de música - 3 dies',
        longDescription:
          'Gaudeix de 3 dies de música amb els millors artistes internacionals al Parc del Fòrum de Barcelona. Del 29 al 31 de maig de 2025.',
        imageUrl: '/images/rewards/primavera-sound.jpg',
        category: 'festivals',
        tokensRequired: 50,
        status: 'available',
        stockAvailable: 25,
        totalStock: 50,
        validUntil: new Date('2025-05-29'),
        termsAndConditions: [
          'Entrada no reemborsable',
          'Vàlida per a una persona',
          'Cal presentar DNI a l\'entrada',
          'No inclou transport ni allotjament',
        ],
        features: [
          'Accés als 3 dies del festival',
          'Més de 200 artistes',
          'Múltiples escenaris',
          'Zona de descans',
        ],
        restrictions: ['Majors de 18 anys', 'No es permet la revenda'],
        howToRedeem: [
          'Bescanvia els teus tokens',
          'Rebràs un codi únic',
          'Canvia el codi per l\'entrada a la web del festival',
          'Descarrega l\'entrada al teu mòbil',
        ],
        partnerName: 'Primavera Sound',
      },
      {
        title: 'Sónar Barcelona',
        description: 'Entrada pel festival Sónar de dia + nit',
        shortDescription: 'Festival de música electrònica',
        longDescription:
          'El festival internacional de música avançada i art multimèdia. Entrada dia + nit.',
        imageUrl: '/images/rewards/sonar.jpg',
        category: 'festivals',
        tokensRequired: 35,
        status: 'available',
        stockAvailable: 40,
        totalStock: 60,
        validUntil: new Date('2025-06-19'),
        termsAndConditions: [
          'Entrada no reemborsable',
          'Vàlida per a un dia',
          'Cal presentar DNI',
        ],
        features: ['Accés dia + nit', 'Tots els escenaris', 'Àrea VIP no inclosa'],
        restrictions: ['Majors de 18 anys'],
        howToRedeem: ['Bescanvia tokens', 'Rebràs codi', 'Canvia a la web del Sónar'],
        partnerName: 'Sónar Festival',
      },
      {
        title: 'Spotify Premium - 3 mesos',
        description: '3 mesos de Spotify Premium gratuït',
        shortDescription: 'Música sense anuncis durant 3 mesos',
        longDescription:
          'Gaudeix de 3 mesos de Spotify Premium amb música sense anuncis, descàrregues offline i qualitat superior.',
        imageUrl: '/images/rewards/spotify.jpg',
        category: 'discounts',
        tokensRequired: 25,
        status: 'available',
        termsAndConditions: [
          'Només per a nous usuaris de Premium',
          'Es renovarà automàticament si no es cancel·la',
        ],
        features: [
          'Música sense anuncis',
          'Descàrregues offline',
          'Qualitat d\'àudio superior',
          'Saltar cançons il·limitat',
        ],
        restrictions: ['Cal compte de Spotify'],
        howToRedeem: ['Bescanvia tokens', 'Rebràs un codi promocional', 'Activa\'l a Spotify'],
        partnerName: 'Spotify',
      },
      {
        title: 'Cinemes 2x1',
        description: 'Entrada 2x1 per a cinemes seleccionats',
        shortDescription: '2 entrades pel preu d\'1',
        longDescription: 'Gaudeix d\'una sessió de cinema amb un amic. Vàlid en cinemes seleccionats de Catalunya.',
        imageUrl: '/images/rewards/cinema.jpg',
        category: 'discounts',
        tokensRequired: 20,
        status: 'available',
        termsAndConditions: [
          'Vàlid durant 3 mesos',
          'No vàlid en estrenes',
          'Subjecte a disponibilitat',
        ],
        features: ['2 entrades estàndard', 'Cinemes seleccionats', 'Pel·lícules no estrena'],
        restrictions: ['No vàlid caps de setmana d\'estrena', 'Cal reserva prèvia'],
        howToRedeem: [
          'Bescanvia tokens',
          'Rebràs un codi',
          'Presenta\'l a taquilla o usa\'l online',
        ],
        partnerName: 'Cinesa',
      },
      {
        title: 'Descompte 20% Zara',
        description: 'Descompte del 20% en tota la botiga',
        shortDescription: '20% de descompte',
        longDescription: 'Descompte del 20% en qualsevol compra a Zara, vàlid durant 1 mes.',
        imageUrl: '/images/rewards/zara.jpg',
        category: 'discounts',
        tokensRequired: 30,
        status: 'low_stock',
        stockAvailable: 8,
        totalStock: 50,
        validUntil: new Date('2025-12-31'),
        termsAndConditions: [
          'Vàlid 1 mes des de la data de bescanvi',
          'No acumulable amb altres ofertes',
          'Una sola compra',
        ],
        features: ['20% de descompte', 'Totes les botigues Zara', 'També online'],
        restrictions: ['No vàlid en rebaixes'],
        howToRedeem: ['Bescanvia tokens', 'Rebràs un codi', 'Usa\'l a botiga o online'],
        partnerName: 'Zara',
      },
      {
        title: 'Experiència Camp Nou',
        description: 'Visita guiada al Camp Nou i Museu del FC Barcelona',
        shortDescription: 'Tour Camp Nou + Museu',
        longDescription:
          'Visita el Camp Nou, vestidors, túnel de jugadors i el Museu del FC Barcelona. Una experiència única!',
        imageUrl: '/images/rewards/camp-nou.jpg',
        category: 'experiences',
        tokensRequired: 60,
        status: 'available',
        stockAvailable: 15,
        totalStock: 30,
        validUntil: new Date('2025-12-31'),
        termsAndConditions: [
          'Cal reserva prèvia',
          'Subjecte a disponibilitat',
          'Entrada per a 1 persona',
        ],
        features: [
          'Visita guiada',
          'Accés al camp',
          'Vestidors i túnel',
          'Museu inclòs',
        ],
        restrictions: ['Cal reservar amb 7 dies d\'antelació'],
        howToRedeem: [
          'Bescanvia tokens',
          'Truca per reservar',
          'Presenta el codi el dia de la visita',
        ],
        partnerName: 'FC Barcelona',
      },
    ]);
    console.log(`✅ Created ${rewards.length} rewards\n`);

    // Create sample donations for the test user
    console.log('💉 Creating sample donations...');
    const donations = await Donation.create([
      {
        userId: testUser._id,
        donationType: 'sang_total',
        date: new Date('2024-03-15'),
        donationCenterId: centers[0]?._id,
        donationCenterName: centers[0]?.name || '',
        tokensEarned: 15,
        volume: 450,
      },
      {
        userId: testUser._id,
        donationType: 'sang_total',
        date: new Date('2024-06-20'),
        donationCenterId: centers[1]?._id,
        donationCenterName: centers[1]?.name || '',
        tokensEarned: 15,
        volume: 450,
      },
      {
        userId: testUser._id,
        donationType: 'plaquetes',
        date: new Date('2024-09-10'),
        donationCenterId: centers[0]?._id,
        donationCenterName: centers[0]?.name || '',
        tokensEarned: 20,
      },
      {
        userId: testUser._id,
        donationType: 'sang_total',
        date: new Date('2024-11-05'),
        donationCenterId: centers[2]?._id,
        donationCenterName: centers[2]?.name || '',
        tokensEarned: 20, // Includes campaign bonus
        volume: 450,
      },
    ]);
    console.log(`✅ Created ${donations.length} donations\n`);

    // Create sample appointments for the test user
    console.log('📅 Creating sample appointments...');
    const appointments = await Appointment.create([
      {
        userId: testUser._id,
        donationCenterId: centers[0]?._id,
        donationType: 'sang_total',
        date: new Date('2025-12-15'),
        time: '10:00',
        status: 'confirmed',
        notes: 'Primera cita del mes',
      },
      {
        userId: testUser._id,
        donationCenterId: centers[1]?._id,
        donationType: 'plaquetes',
        date: new Date('2025-12-20'),
        time: '14:00',
        status: 'scheduled',
      },
      {
        userId: testUser._id,
        donationCenterId: centers[0]?._id,
        donationType: 'sang_total',
        date: new Date('2024-10-10'),
        time: '11:30',
        status: 'completed',
      },
    ]);
    console.log(`✅ Created ${appointments.length} appointments\n`);

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Users: 1`);
    console.log(`   - Donation Centers: ${centers.length}`);
    console.log(`   - Campaigns: ${campaigns.length}`);
    console.log(`   - Rewards: ${rewards.length}`);
    console.log(`   - Donations: ${donations.length}`);
    console.log(`   - Appointments: ${appointments.length}`);
    console.log('\n🔑 Test credentials:');
    console.log(`   Email: test@puntdonacio.cat`);
    console.log(`   Password: password123\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDatabase };
