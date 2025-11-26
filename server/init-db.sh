#!/bin/sh

echo "🚀 Starting initialization process..."

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
until nc -z mongodb 27017; do
  echo "   MongoDB is unavailable - sleeping"
  sleep 2
done

echo "✓ MongoDB is ready!"

# Give MongoDB a bit more time to fully initialize
sleep 3

# Check if database has data
echo "🔍 Checking if database needs seeding..."

# Run a Node script to check if database is empty
node -e "
const mongoose = require('mongoose');
const { env } = require('./dist/config/env');

async function checkDatabase() {
  try {
    await mongoose.connect(env.mongodbUri);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const donationCentersCollection = collections.find(c => c.name === 'donationcenters');

    if (!donationCentersCollection) {
      console.log('empty');
      process.exit(0);
    }

    const count = await db.collection('donationcenters').countDocuments();

    if (count === 0) {
      console.log('empty');
    } else {
      console.log('has_data');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    console.log('empty');
    process.exit(0);
  }
}

checkDatabase();
" > /tmp/db_status.txt

DB_STATUS=$(cat /tmp/db_status.txt | tail -1)

if [ "$DB_STATUS" = "empty" ]; then
  echo "📦 Database is empty. Running seed script..."
  npm run seed:real

  if [ $? -eq 0 ]; then
    echo "✓ Database seeded successfully!"
  else
    echo "⚠️  Warning: Seed script failed, but continuing..."
  fi
else
  echo "✓ Database already has data. Skipping seed."
fi

# Start the application
echo "🚀 Starting application..."
exec npm run dev
