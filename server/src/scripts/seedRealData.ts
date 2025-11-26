import mongoose from 'mongoose';
import axios from 'axios';
import { DonationCenter } from '../models/DonationCenter';
import { Campaign } from '../models/Campaign';
import { env } from '../config/env';
import { getCampaignData } from './data/campaignData';

// Overpass API URL
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Query to get hospitals in Catalonia
// area["name"="Catalunya"]->.searchArea;
// (
//   node["amenity"="hospital"](area.searchArea);
//   way["amenity"="hospital"](area.searchArea);
//   relation["amenity"="hospital"](area.searchArea);
// );
// out center;
const OVERPASS_QUERY = `
[out:json];
area["name"="Catalunya"]->.searchArea;
(
  node["amenity"="hospital"](area.searchArea);
  way["amenity"="hospital"](area.searchArea);
  relation["amenity"="hospital"](area.searchArea);
);
out center;
`;

async function seedRealData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(env.mongodbUri);
        console.log('Connected to database');

        console.log('Fetching data from Overpass API...');
        const response = await axios.post(OVERPASS_API_URL, `data=${encodeURIComponent(OVERPASS_QUERY)}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const elements = response.data.elements;
        console.log(`Found ${elements.length} hospitals in Catalonia.`);

        // Transform data
        const realCenters = elements
            .filter((el: any) => el.tags && el.tags.name) // Filter out elements without name
            .map((el: any) => {
                const lat = el.lat || el.center?.lat;
                const lng = el.lon || el.center?.lon;

                if (!lat || !lng) return null;

                // Randomize some data that we don't have
                const openNow = Math.random() > 0.3; // 70% chance of being open
                const schedule = [
                    { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 3, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 4, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 5, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
                ];

                return {
                    name: el.tags.name,
                    address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}` : 'Adreça no disponible',
                    city: el.tags['addr:city'] || 'Catalunya',
                    postalCode: el.tags['addr:postcode'] || '08000',
                    coordinates: {
                        type: 'Point',
                        coordinates: [lng, lat]  // [lng, lat] - ORDEN IMPORTANTE!
                    },
                    type: 'fix',
                    openNow,
                    schedule,
                    phone: el.tags.phone || el.tags['contact:phone'] || '900 000 000',
                    facilities: ['Accessible', 'Parking'], // Default facilities
                    capacity: Math.floor(Math.random() * 10) + 5,
                };
            })
            .filter((c: any) => c !== null);

        console.log(`Processed ${realCenters.length} valid centers.`);

        // Manually add important centers that might be missing
        const manualCenters = [
            {
                name: 'Hospital de Mataró',
                address: 'Carretera de Cirera, 230',
                city: 'Mataró',
                postalCode: '08304',
                coordinates: {
                    type: 'Point',
                    coordinates: [2.4333, 41.5525]
                },
                type: 'fix',
                openNow: true,
                schedule: [
                    { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 3, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 4, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 5, openTime: '08:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '09:00', closeTime: '14:00', isClosed: false },
                    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
                ],
                phone: '937 41 77 00',
                facilities: ['Accessible', 'Parking', 'Cafeteria'],
                capacity: 10,
            },
            {
                name: 'Unitat Mòbil - Plaça Catalunya',
                address: 'Plaça de Catalunya',
                city: 'Barcelona',
                postalCode: '08002',
                coordinates: {
                    type: 'Point',
                    coordinates: [2.1704, 41.3874]
                },
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
                name: 'Unitat Mòbil - Mataró Parc',
                address: 'Carrer d\'Estrasburg, 5',
                city: 'Mataró',
                postalCode: '08304',
                coordinates: {
                    type: 'Point',
                    coordinates: [2.4300, 41.5585]
                },
                type: 'mobile',
                openNow: true,
                schedule: [
                    { dayOfWeek: 5, openTime: '16:00', closeTime: '20:00', isClosed: false },
                    { dayOfWeek: 6, openTime: '10:00', closeTime: '20:00', isClosed: false },
                ],
                phone: '937 90 44 33',
                facilities: ['Parking'],
                capacity: 4,
            }
        ];

        // Clear existing data
        console.log('Clearing existing Donation Centers...');
        await DonationCenter.deleteMany({});

        // Insert donation centers and capture IDs
        console.log('Inserting donation centers...');
        const insertedCenters = await DonationCenter.create([...realCenters, ...manualCenters]);
        const centerIds = insertedCenters.map(c => c._id.toString());
        console.log(`✓ Seeded ${insertedCenters.length} donation centers`);

        // Seed campaigns
        try {
            console.log('Clearing existing Campaigns...');
            await Campaign.deleteMany({});

            console.log('Seeding Campaigns...');
            const campaignData = getCampaignData(centerIds);
            await Campaign.create(campaignData);
            console.log(`✓ Seeded ${campaignData.length} campaigns`);
        } catch (error) {
            console.error('Error seeding campaigns:', error);
            // Don't exit - campaigns are not critical for app startup
        }

        console.log('Database seeded successfully with REAL data!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedRealData();
