import mongoose from 'mongoose';
import { DonationCenter } from '../models/DonationCenter';
import { Campaign } from '../models/Campaign';
import { env } from '../config/env';

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(env.mongodbUri);
        console.log('Connected to database');

        // Clear existing data
        console.log('Clearing existing data...');
        await DonationCenter.deleteMany({});
        await Campaign.deleteMany({});

        console.log('Seeding Donation Centers...');
        const centers = await DonationCenter.create([
            {
                name: 'Hospital Clínic de Barcelona',
                address: 'Carrer de Villarroel, 170',
                city: 'Barcelona',
                postalCode: '08036',
                coordinates: { lat: 41.3886, lng: 2.1550 },
                type: 'fix',
                openNow: true,
                schedule: [
                    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
                ],
                phone: '932 27 54 00',
                facilities: ['Parking', 'Cafeteria', 'Wifi'],
                capacity: 10,
            },
            {
                name: 'Hospital de la Santa Creu i Sant Pau',
                address: 'Carrer de Sant Quintí, 89',
                city: 'Barcelona',
                postalCode: '08041',
                coordinates: { lat: 41.4131, lng: 2.1760 },
                type: 'fix',
                openNow: true,
                schedule: [
                    { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
                ],
                phone: '932 91 90 00',
                facilities: ['Parking', 'Wifi'],
                capacity: 8,
            },
            {
                name: 'Unitat Mòbil - Plaça Catalunya',
                address: 'Plaça de Catalunya',
                city: 'Barcelona',
                postalCode: '08002',
                coordinates: { lat: 41.3874, lng: 2.1704 },
                type: 'mobile',
                openNow: true,
                schedule: [
                    { dayOfWeek: 1, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 2, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 3, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 4, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 5, openTime: '10:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '00:00', closeTime: '00:00', isClosed: true },
                    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
                ],
                phone: '932 76 90 00',
                facilities: [],
                capacity: 4,
            },
            {
                name: 'Hospital Vall d\'Hebron',
                address: 'Passeig de la Vall d\'Hebron, 119',
                city: 'Barcelona',
                postalCode: '08035',
                coordinates: { lat: 41.4275, lng: 2.1434 },
                type: 'fix',
                openNow: true,
                schedule: [
                    { dayOfWeek: 1, openTime: '08:30', closeTime: '20:30', isClosed: false },
                    { dayOfWeek: 2, openTime: '08:30', closeTime: '20:30', isClosed: false },
                    { dayOfWeek: 3, openTime: '08:30', closeTime: '20:30', isClosed: false },
                    { dayOfWeek: 4, openTime: '08:30', closeTime: '20:30', isClosed: false },
                    { dayOfWeek: 5, openTime: '08:30', closeTime: '20:30', isClosed: false },
                    { dayOfWeek: 6, openTime: '10:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 0, openTime: '10:00', closeTime: '20:00', isClosed: false },
                ],
                phone: '934 89 30 00',
                facilities: ['Parking', 'Cafeteria', 'Wifi', 'Accessible'],
                capacity: 12,
            },
        ]);

        console.log('Seeding Campaigns...');
        await Campaign.create([
            {
                title: 'Marató de Donació de Sang',
                description: 'Uneix-te a la gran marató de donació de sang de Barcelona. El teu gest pot salvar 3 vides.',
                shortDescription: 'La gran festa de la donació a Barcelona',
                longDescription: 'La Marató de Donants de Sang de Catalunya és la campanya de donació més gran de l\'any. Durant una setmana, els principals hospitals i punts de donació s\'omplen d\'activitats, música i bon ambient per celebrar la solidaritat. Vine a donar sang i gaudeix d\'una experiència única. Necessitem aconseguir 10.000 donacions per remuntar les reserves després de les festes.',
                imageUrl: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80',
                status: 'active',
                startDate: new Date(),
                endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Ends in 30 days
                targetDonations: 10000,
                currentDonations: 4532,
                targetBloodTypes: ['A+', 'A-', 'O+', 'O-'],
                targetDonationType: 'sang_total',
                priority: 'high',
                bonusTokens: 50,
                requirements: ['Major de 18 anys', 'Pes mínim 50kg', 'No estar en dejú'],
                benefits: ['Esmorzar especial', 'Samarreta exclusiva', 'Pàrquing gratuït'],
                participatingCenters: centers.map(c => c._id.toString()),
            },
            {
                title: 'Campanya d\'Estiu',
                description: 'A l\'estiu, les donacions baixen un 30%. Ajuda\'ns a mantenir les reserves.',
                shortDescription: 'No facis vacances de la solidaritat',
                longDescription: 'Durant els mesos d\'estiu, molta gent marxa de vacances i les donacions de sang disminueixen considerablement. Però les necessitats als hospitals es mantenen. Per això, et demanem que abans de marxar, o quan tornis, vinguis a donar sang. És un moment imprescindible per garantir que tothom qui ho necessiti pugui rebre sang.',
                imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80',
                status: 'upcoming',
                startDate: new Date(new Date().setDate(new Date().getDate() + 15)), // Starts in 15 days
                endDate: new Date(new Date().setDate(new Date().getDate() + 75)),
                targetDonations: 5000,
                currentDonations: 0,
                priority: 'normal',
                bonusTokens: 25,
                requirements: ['Major de 18 anys', 'Pes mínim 50kg'],
                benefits: ['Gelat gratuït', 'Barret de palla'],
                participatingCenters: [centers[0]._id.toString(), centers[2]._id.toString()],
            },
            {
                title: 'Crida Urgent Grup 0-',
                description: 'Les reserves del grup 0- estan sota mínims. Si ets donant universal, et necessitem ara.',
                shortDescription: 'Emergència: Reserves 0- crítiques',
                longDescription: 'Estem en una situació crítica per al grup sanguini 0 Negatiu. Aquest grup és vital perquè és el donant universal i es pot utilitzar en situacions d\'emergència quan no hi ha temps de comprovar el grup del pacient. Si ets 0-, si us plau, vine a donar tan aviat com puguis. La teva sang és l\'única que pot salvar qualsevol vida en qualsevol moment.',
                imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80',
                status: 'active',
                startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
                endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
                targetDonations: 500,
                currentDonations: 120,
                targetBloodTypes: ['O-'],
                priority: 'urgent',
                bonusTokens: 100,
                requirements: ['Grup sanguini O-', 'Major de 18 anys'],
                benefits: ['Prioritat sense cita', 'Obsequi especial'],
                participatingCenters: centers.map(c => c._id.toString()),
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
