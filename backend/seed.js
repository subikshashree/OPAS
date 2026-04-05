const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = encodeURIComponent((process.env.MONGODB_PASS || '').trim());
const MONGO_HOST = process.env.MONGODB_HOST;
const DB_NAME = process.env.DB_NAME || 'opas_db';

const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

const sampleUsers = [
  {
    _id: '990001',
    name: 'System Admin',
    email: 'admin@opas.edu',
    roles: ['ADMIN'],
    status: 'ACTIVE',
    department: 'Administration',
    avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=dc2626&color=fff',
    createdAt: new Date().toISOString()
  },
  {
    _id: '880002',
    name: 'Dr. Sarah Head',
    email: 'hod@opas.edu',
    roles: ['HOD'],
    status: 'ACTIVE',
    department: 'Computer Science',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Head&background=2563eb&color=fff',
    createdAt: new Date().toISOString()
  },
  {
    _id: '770003',
    name: 'Mr. James Warden',
    email: 'warden@opas.edu',
    roles: ['WARDEN'],
    status: 'ACTIVE',
    department: 'Hostel Management',
    hostelBlock: 'Mens Hostel A',
    avatar: 'https://ui-avatars.com/api/?name=James+Warden&background=d97706&color=fff',
    createdAt: new Date().toISOString()
  },
  {
    _id: '660004',
    name: 'Prof. Alan Mentor',
    email: 'faculty@opas.edu',
    roles: ['FACULTY'],
    status: 'ACTIVE',
    department: 'Computer Science',
    avatar: 'https://ui-avatars.com/api/?name=Alan+Mentor&background=059669&color=fff',
    createdAt: new Date().toISOString()
  },
  {
    _id: '550005',
    name: 'Robert Parent Sr.',
    email: 'parent@opas.edu',
    roles: ['PARENT'],
    status: 'ACTIVE',
    avatar: 'https://ui-avatars.com/api/?name=Robert+Parent&background=4f46e5&color=fff',
    createdAt: new Date().toISOString()
  },
  {
    _id: '108422',
    name: 'Bob Student Jr.',
    email: 'student@opas.edu',
    roles: ['STUDENT'],
    status: 'ACTIVE',
    studentId: '108422',
    department: 'Computer Science',
    isHosteler: true,
    roomNumber: 'A-201',
    hostelBlock: 'Mens Hostel A',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Student&background=0891b2&color=fff',
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');

    console.log('Clearing existing users to prevent duplicates...');
    const deleteResult = await usersCollection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old records.`);

    console.log(`Inserting ${sampleUsers.length} fresh sample users...`);
    const insertResult = await usersCollection.insertMany(sampleUsers);
    
    // Now establish the relationships with the actual MongoDB _ids
    console.log('Establishing mentor/parent/student relationships...');
    const insertedUsers = await usersCollection.find({}).toArray();
    
    const student = insertedUsers.find(u => u.email === 'student@opas.edu');
    const parent = insertedUsers.find(u => u.email === 'parent@opas.edu');
    const mentor = insertedUsers.find(u => u.email === 'faculty@opas.edu');
    const warden = insertedUsers.find(u => u.email === 'warden@opas.edu');

    // Link Student to Parent, Mentor, Warden
    await usersCollection.updateOne({ _id: student._id }, {
        $set: {
            parentId: parent._id.toString(),
            mentorId: mentor._id.toString(),
            wardenId: warden._id.toString()
        }
    });

    // Link Parent to Ward (Student)
    await usersCollection.updateOne({ _id: parent._id }, {
        $set: { wardId: student._id.toString() }
    });

    // Link Mentor to Mentee (Student)
    await usersCollection.updateOne({ _id: mentor._id }, {
        $set: { menteeIds: [student._id.toString()] }
    });

    console.log('✅ Sample data successfully inserted and relationships linked!');
  } catch (e) {
    console.error('❌ Error during seeding:', e.message);
  } finally {
    await client.close();
  }
}

seed();
