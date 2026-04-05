const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', 'Mentor', 'Parent', 'Warden', 'HoD'],
        required: true
    },
    // References for specific roles
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For student
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For student
    isHosteller: { type: Boolean, default: false }, // For student
    roomNumber: { type: String }, // For hostel student
    department: { type: String }, // For HoD, Mentor, Student
    cgpa: { type: Number, default: 0 },
    attendance: { type: Number, default: 100 }
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
