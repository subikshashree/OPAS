const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
    role: { type: String, enum: ['Parent', 'Warden', 'Mentor', 'HoD'], required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date }
}, { _id: false });

const leaveSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: {
        type: String,
        enum: ['Special Permission', 'Emergency Leave', 'General Permission', 'OD'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvalChain: [approvalSchema], // dynamically generated based on rules
    rejectionReason: { type: String }
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
