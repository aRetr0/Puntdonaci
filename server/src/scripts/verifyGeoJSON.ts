import mongoose from 'mongoose';
import { DonationCenter } from '../models/DonationCenter';
import { env } from '../config/env';

async function verifyGeoJSON() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to database\n');

    // Check total count
    const total = await DonationCenter.countDocuments();
    console.log(`Total centers: ${total}`);

    // Check GeoJSON format
    const geoJSONCount = await DonationCenter.countDocuments({
      'coordinates.type': 'Point'
    });
    console.log(`Centers with GeoJSON format: ${geoJSONCount}`);

    if (geoJSONCount !== total) {
      console.log(`⚠ Warning: ${total - geoJSONCount} centers NOT in GeoJSON format`);
    } else {
      console.log('✓ All centers in GeoJSON format');
    }

    // List unique cities
    const cities = await DonationCenter.distinct('city');
    console.log(`\nCities represented: ${cities.length}`);
    console.log('Cities:', cities.sort().join(', '));

    // Count by city
    const cityCounts = await DonationCenter.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\nCenters per city:');
    cityCounts.forEach(c => console.log(`  ${c._id}: ${c.count}`));

    // Test geospatial query - Barcelona center
    console.log('\n=== Testing Geospatial Query ===');
    console.log('Searching for centers near Barcelona (41.3851, 2.1734) within 50km...\n');

    const barcelonaCenters = await DonationCenter.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [2.1734, 41.3851] // [lng, lat] Barcelona center
          },
          $maxDistance: 50000 // 50km in meters
        }
      }
    }).limit(10);

    console.log(`Found ${barcelonaCenters.length} centers:`);
    barcelonaCenters.forEach((c, i) => {
      const lng = c.coordinates.coordinates[0];
      const lat = c.coordinates.coordinates[1];
      console.log(`  ${i + 1}. ${c.name} (${c.city}) - [${lng}, ${lat}]`);
    });

    // Test geospatial query - Girona
    console.log('\n=== Testing Girona Region ===');
    const gironaCenters = await DonationCenter.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [2.8214, 41.9794] // [lng, lat] Girona center
          },
          $maxDistance: 50000
        }
      }
    }).limit(5);

    console.log(`Centers near Girona: ${gironaCenters.length}`);
    gironaCenters.forEach(c => console.log(`  - ${c.name} (${c.city})`));

    // Check indexes
    const indexes = await mongoose.connection.db
      .collection('donationcenters')
      .indexes();

    console.log('\n=== Database Indexes ===');
    indexes.forEach(idx => {
      console.log(`  ${idx.name}: ${JSON.stringify(idx.key)}`);
      if (idx['2dsphereIndexVersion']) {
        console.log(`    → 2dsphere version: ${idx['2dsphereIndexVersion']}`);
      }
    });

    // Sample document
    const sample = await DonationCenter.findOne();
    if (sample) {
      console.log('\n=== Sample Document ===');
      console.log(`Name: ${sample.name}`);
      console.log(`City: ${sample.city}`);
      console.log(`Coordinates:`, JSON.stringify(sample.coordinates, null, 2));
    }

    console.log('\n✓ Verification completed');
    process.exit(0);
  } catch (error) {
    console.error('Verification error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

verifyGeoJSON();
