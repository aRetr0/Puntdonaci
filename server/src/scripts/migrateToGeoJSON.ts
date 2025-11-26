import mongoose from 'mongoose';
import { env } from '../config/env';

async function migrateToGeoJSON() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to database\n');

    const db = mongoose.connection.db;
    const collection = db.collection('donationcenters');

    // Find all documents with old format (have lat/lng fields)
    const oldFormatDocs = await collection.find({
      'coordinates.lat': { $exists: true }
    }).toArray();

    console.log(`Found ${oldFormatDocs.length} documents with old format\n`);

    if (oldFormatDocs.length === 0) {
      console.log('No migration needed - all documents already in GeoJSON format');
      process.exit(0);
    }

    // Migrate each document
    let successCount = 0;
    let errorCount = 0;

    for (const doc of oldFormatDocs) {
      try {
        const { lat, lng } = doc.coordinates;

        await collection.updateOne(
          { _id: doc._id },
          {
            $set: {
              coordinates: {
                type: 'Point',
                coordinates: [lng, lat]  // [longitude, latitude]
              }
            }
          }
        );

        successCount++;
        console.log(`✓ Migrated: ${doc.name} (${doc.city})`);
      } catch (err) {
        errorCount++;
        console.error(`✗ Failed to migrate ${doc.name}:`, err);
      }
    }

    console.log(`\n=== Migration Summary ===`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    // Drop old index if it exists
    try {
      await collection.dropIndex('coordinates_2dsphere');
      console.log('Dropped old 2dsphere index');
    } catch (err) {
      console.log('No old 2dsphere index to drop (this is expected)');
    }

    // Create new 2dsphere index
    try {
      await collection.createIndex({ coordinates: '2dsphere' });
      console.log('Created new 2dsphere index on GeoJSON coordinates');
    } catch (err) {
      console.error('Failed to create 2dsphere index:', err);
    }

    // Verify migration
    const newFormatCount = await collection.countDocuments({
      'coordinates.type': 'Point',
      'coordinates.coordinates': { $exists: true }
    });

    const oldFormatCount = await collection.countDocuments({
      'coordinates.lat': { $exists: true }
    });

    console.log(`\n=== Verification ===`);
    console.log(`Documents in new format: ${newFormatCount}`);
    console.log(`Documents in old format: ${oldFormatCount}`);

    if (oldFormatCount === 0) {
      console.log('\n✓ Migration completed successfully!');
    } else {
      console.log('\n⚠ Warning: Some documents still in old format');
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateToGeoJSON();
