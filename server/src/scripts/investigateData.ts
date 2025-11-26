import mongoose from 'mongoose';
import { DonationCenter } from '../models/DonationCenter';
import { env } from '../config/env';

async function investigateData() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to database\n');

    // Count total centers
    const total = await DonationCenter.countDocuments();
    console.log(`Total centers: ${total}`);

    // List all unique cities
    const cities = await DonationCenter.distinct('city');
    console.log(`\nUnique cities (${cities.length}):`);
    cities.sort().forEach(city => console.log(`  - ${city}`));

    // Count by city
    const cityCounts = await DonationCenter.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\nCenters per city:');
    cityCounts.forEach(c => console.log(`  - ${c._id}: ${c.count}`));

    // Check coordinate format
    const sample = await DonationCenter.findOne();
    if (sample) {
      console.log('\nSample coordinates format:');
      console.log(JSON.stringify(sample.coordinates, null, 2));
    }

    // Check if 2dsphere index exists
    const indexes = await mongoose.connection.db
      .collection('donationcenters')
      .indexes();

    console.log('\nExisting indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)} (${idx.name})`);
    });

    // List first 10 centers
    const centers = await DonationCenter.find().limit(10);
    console.log('\nFirst 10 centers:');
    centers.forEach(c => {
      console.log(`  - ${c.name} (${c.city}) - ${JSON.stringify(c.coordinates)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Investigation error:', error);
    process.exit(1);
  }
}

investigateData();
