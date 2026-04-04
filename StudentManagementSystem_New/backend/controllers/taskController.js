const Task = require('../models/Task');
const User = require('../models/User');

const getTasks = async (req, res) => {
    try {
        if (req.user.role === 'Student') {
            const tasks = await Task.find({ student: req.user._id }).populate('mentor', 'name').sort('-dueDate');
            return res.json(tasks);
        } else if (req.user.role === 'Mentor') {
            const tasks = await Task.find({ mentor: req.user._id }).populate('student', 'name').sort('-dueDate');
            return res.json(tasks);
        }
        res.status(403).json({ message: 'Not authorized to view tasks' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        if (req.user.role !== 'Mentor') return res.status(403).json({ message: 'Only mentors can assign tasks' });
        
        const { studentId, title, description, dueDate } = req.body;
        const student = await User.findById(studentId);
        if (!student || student.mentor?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Student not found or not assigned to you' });
        }

        const task = await Task.create({
            mentor: req.user._id,
            student: studentId,
            title,
            description,
            dueDate
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.student.toString() !== req.user._id.toString() && task.mentor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        task.status = status;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTaskStatus };
