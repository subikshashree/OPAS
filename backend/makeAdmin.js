const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = encodeURIComponent((process.env.MONGODB_PASS || '').trim());
const MONGO_HOST = process.env.MONGODB_HOST;
const DB_NAME = process.env.DB_NAME || 'opas_db';

const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

async function makeAdmin() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    // Make subikshashrees@gmail.com an ADMIN
    const result1 = await usersCollection.updateOne(
      { email: 'subikshashrees@gmail.com' },
      { 
        $set: { 
          roles: ['ADMIN'],
          name: 'Subiksha Shree',
          status: 'ACTIVE'
        } 
      },
      { upsert: true }
    );

    // Make 664893 an ADMIN (assuming it's either studentId or email prefix, we'll check both just in case, but usually studentId or an explicit ID)
    const result2 = await usersCollection.updateOne(
      { 
        $or: [
          { studentId: '664893' },
          { id: '664893' },
          { email: '664893@opas.edu' } // Fallback if it's considered an email
        ]
      },
      { 
        $set: { 
          roles: ['ADMIN'],
          studentId: '664893', // ensure it's set if upserted
          status: 'ACTIVE'
        },
        $setOnInsert: {
          email: '664893@opas.edu',
          name: 'Admin 664893'
        }
      },
      { upsert: true }
    );

    console.log('✅ Accounts successfully updated to ADMIN!');
    console.log(`- subikshashrees@gmail.com (Upserted: ${result1.upsertedCount > 0}, Modified: ${result1.modifiedCount})`);
    console.log(`- 664893 (Upserted: ${result2.upsertedCount > 0}, Modified: ${result2.modifiedCount})`);

  } catch (e) {
    console.error('❌ Error updating accounts:', e.message);
  } finally {
    await client.close();
  }
}

makeAdmin();
