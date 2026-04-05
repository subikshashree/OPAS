const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// MongoDB Connection
const MONGO_USER = process.env.MONGODB_USER;
const MONGO_PASS = encodeURIComponent(process.env.MONGODB_PASS || '');
const MONGO_HOST = process.env.MONGODB_HOST;
const MONGO_URI = process.env.MONGODB_URI || `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/?retryWrites=true&w=majority&appName=Cluster0`;
const DB_NAME = process.env.DB_NAME || 'opas_db';

let db;
let usersCollection;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection('users');
    
    // Create unique index on email
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log(`   Database: ${DB_NAME}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// ─── Health Check ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'OPAS Backend API is running', database: DB_NAME });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── LOGIN / REGISTER ──────────────────────────────────────────
// POST /api/opas/auth/login
// Body: { email, name?, avatar? }
// If user exists → return them. If not → auto-register as STUDENT.
app.post('/api/opas/auth/login', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await usersCollection.findOne({ email: normalizedEmail });

    if (user) {
      return res.json(formatUser(user));
    }

    // Auto-register new user as STUDENT
    const numericId = String(100000 + Math.floor(Math.random() * 900000));
    const newUser = {
      name: name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      roles: ['STUDENT'],
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || normalizedEmail.split('@')[0])}&background=random`,
      permissions: [],
      status: 'ACTIVE',
      studentId: numericId,
      department: 'Computer Science',
      isHosteler: false,
      residentialType: null,
      roomNumber: null,
      hostelBlock: null,
      busNumber: null,
      phone: null,
      mentorId: null,
      parentId: null,
      wardenId: null,
      wardId: null,
      menteeIds: [],
      hostelName: null,
      createdAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId;
    
    console.log(`🆕 New user registered: ${normalizedEmail} (ID: ${numericId})`);
    return res.json(formatUser(newUser));
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET ALL USERS ──────────────────────────────────────────────
app.get('/api/opas/users', async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    res.json(users.map(formatUser));
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET USER BY ID ─────────────────────────────────────────────
app.get('/api/opas/users/:id', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET USER BY EMAIL ──────────────────────────────────────────
app.get('/api/opas/users/email/:email', async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.params.email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(user));
  } catch (err) {
    console.error('Get user by email error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── UPDATE USER ────────────────────────────────────────────────
app.put('/api/opas/users/:id', async (req, res) => {
  try {
    const updateFields = {};
    const allowed = [
      'name', 'roles', 'department', 'phone', 'avatar', 'status',
      'mentorId', 'parentId', 'wardenId', 'wardId', 'menteeIds',
      'isHosteler', 'residentialType', 'roomNumber', 'hostelBlock',
      'busNumber', 'hostelName', 'studentId'
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        // Handle single role string → roles array conversion
        if (key === 'role') {
          updateFields.roles = [req.body[key]];
        } else {
          updateFields[key] = req.body[key];
        }
      }
    }
    
    // Also handle "role" → "roles" mapping from Admin panel
    if (req.body.role && !req.body.roles) {
      updateFields.roles = [req.body.role];
    }

    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ error: 'User not found' });
    
    console.log(`📝 User updated: ${result.email} → ${JSON.stringify(updateFields)}`);
    res.json(formatUser(result));
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── DELETE USER ────────────────────────────────────────────────
app.delete('/api/opas/users/:id', async (req, res) => {
  try {
    const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── FORMAT HELPER ──────────────────────────────────────────────
function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    roles: user.roles || ['STUDENT'],
    avatar: user.avatar,
    permissions: user.permissions || [],
    status: user.status || 'ACTIVE',
    phone: user.phone || null,
    studentId: user.studentId || null,
    isHosteler: user.isHosteler || false,
    residentialType: user.residentialType || null,
    roomNumber: user.roomNumber || null,
    hostelBlock: user.hostelBlock || null,
    busNumber: user.busNumber || null,
    department: user.department || null,
    mentorId: user.mentorId || null,
    parentId: user.parentId || null,
    wardenId: user.wardenId || null,
    wardId: user.wardId || null,
    menteeIds: user.menteeIds || [],
    hostelName: user.hostelName || null,
  };
}

// ─── START SERVER ───────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 OPAS Backend running on port ${PORT}`);
  });
});
