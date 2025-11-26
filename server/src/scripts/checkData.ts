import mongoose from 'mongoose';
import { DonationCenter } from '../models/DonationCenter';
import { env } from '../config/env';

async function checkData() {
    try {
        await mongoose.connect(env.mongodbUri);
        console.log('Connected to database');

        // Count total centers
        const total = await DonationCenter.countDocuments();
        console.log(`Total centers: ${total}`);

        // Check for Mataró
        const mataroCenters = await DonationCenter.find({ city: /Mataró/i });
        console.log(`Centers in Mataró: ${mataroCenters.length}`);
        mataroCenters.forEach(c => console.log(` - ${c.name} (${c.type}, Open: ${c.openNow})`));

        // Check total closed centers (to verify previous issue)
        const closed = await DonationCenter.countDocuments({ openNow: false });
        console.log(`Total closed centers: ${closed}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkData();
