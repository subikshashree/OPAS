const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        let stats = { profile: await User.findById(user._id).select('-password').populate('mentor parent', 'name email') };

        if (user.role === 'Student') {
            stats.attendance = user.attendance;
            stats.cgpa = user.cgpa;
        } else if (user.role === 'Mentor') {
            const students = await User.find({ mentor: user._id }).select('name email attendance cgpa');
            stats.mentees = students;
            stats.avgAttendance = students.reduce((acc, s) => acc + (s.attendance || 0), 0) / (students.length || 1);
        } else if (user.role === 'Parent') {
            const students = await User.find({ parent: user._id }).select('-password');
            stats.children = students;
        } else if (user.role === 'Warden') {
            const students = await User.find({ isHosteller: true }).select('name roomNumber attendance');
            stats.hostelStudents = students;
            stats.count = students.length;
        } else if (user.role === 'HoD') {
            const mentors = await User.find({ role: 'Mentor', department: user.department });
            const students = await User.find({ department: user.department, role: 'Student' });
            stats.mentorsCount = mentors.length;
            stats.studentsCount = students.length;
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
