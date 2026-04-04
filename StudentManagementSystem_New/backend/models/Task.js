const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    remarks: { type: String }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
