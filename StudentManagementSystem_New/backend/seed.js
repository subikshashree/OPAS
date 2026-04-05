const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    { name: 'Admin HoD', email: 'hod@test.com', password: 'password123', role: 'HoD', department: 'CS' },
    { name: 'Warden John', email: 'warden@test.com', password: 'password123', role: 'Warden' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        await User.deleteMany();
        // The pre-save hook for password hashing won't run on insertMany, so we use create instead for hashing
        const hod = await User.create(users[0]);
        const warden = await User.create(users[1]);

        const mentor = await User.create({ name: 'Mentor Jane', email: 'mentor@test.com', password: 'password123', role: 'Mentor', department: 'CS' });
        const parent = await User.create({ name: 'Parent Bob', email: 'parent@test.com', password: 'password123', role: 'Parent' });
        
        await User.create({ 
            name: 'Student Alice', 
            email: 'student@test.com', 
            password: 'password123', 
            role: 'Student', 
            department: 'CS',
            isHosteller: true,
            roomNumber: 'A101',
            mentor: mentor._id,
            parent: parent._id,
            cgpa: 8.5,
            attendance: 92
        });

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
