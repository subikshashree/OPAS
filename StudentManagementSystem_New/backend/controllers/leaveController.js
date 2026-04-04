const Leave = require('../models/Leave');
const User = require('../models/User');

const getApprovalChain = (leaveType, isHosteller) => {
    let chain = [];
    switch (leaveType) {
        case 'Special Permission':
            chain.push({ role: 'Parent' });
            if (isHosteller) chain.push({ role: 'Warden' });
            chain.push({ role: 'Mentor' });
            break;
        case 'Emergency Leave':
            chain.push({ role: 'Parent' });
            if (isHosteller) chain.push({ role: 'Warden' });
            break;
        case 'General Permission':
            if (isHosteller) chain.push({ role: 'Warden' });
            break;
        case 'OD':
            chain.push({ role: 'Parent' });
            if (isHosteller) chain.push({ role: 'Warden' });
            chain.push({ role: 'Mentor' });
            chain.push({ role: 'HoD' });
            break;
    }
    return chain;
};

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private/Student
const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const student = await User.findById(req.user._id);

        if (!student || student.role !== 'Student') {
            return res.status(403).json({ message: 'Only students can apply for leaves' });
        }

        const approvalChain = getApprovalChain(leaveType, student.isHosteller);
        const status = approvalChain.length === 0 ? 'Approved' : 'Pending';

        const leave = await Leave.create({
            student: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
            approvalChain,
            status
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject leave
// @route   PUT /api/leaves/:id/approve
// @access  Private
const approveLeave = async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const leave = await Leave.findById(req.params.id).populate('student');

        if (!leave) return res.status(404).json({ message: 'Leave not found' });
        if (leave.status !== 'Pending') return res.status(400).json({ message: 'Leave already processed' });

        const userRole = req.user.role;
        const currentPendingStepIndex = leave.approvalChain.findIndex(step => step.status === 'Pending');
        
        if (currentPendingStepIndex === -1) return res.status(400).json({ message: 'No pending approvals' });

        const currentStep = leave.approvalChain[currentPendingStepIndex];

        if (currentStep.role !== userRole) return res.status(403).json({ message: `Waiting for ${currentStep.role} approval` });

        if (userRole === 'Parent' && leave.student.parent?.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized for this student' });
        if (userRole === 'Mentor' && leave.student.mentor?.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized for this student' });
        if (userRole === 'HoD' && leave.student.department !== req.user.department) return res.status(403).json({ message: 'Not authorized for this department' });

        leave.approvalChain[currentPendingStepIndex].status = status;
        leave.approvalChain[currentPendingStepIndex].approvedBy = req.user._id;
        leave.approvalChain[currentPendingStepIndex].updatedAt = Date.now();

        if (status === 'Rejected') {
            leave.status = 'Rejected';
            leave.rejectionReason = rejectionReason;
        } else {
            const allApproved = leave.approvalChain.every(step => step.status === 'Approved');
            if (allApproved) leave.status = 'Approved';
        }

        await leave.save();
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leaves
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
    try {
        const user = req.user;
        let leaves = [];

        if (user.role === 'Student') {
            leaves = await Leave.find({ student: user._id }).sort('-createdAt');
        } else if (user.role === 'Parent') {
            const students = await User.find({ parent: user._id });
            const studentIds = students.map(s => s._id);
            leaves = await Leave.find({ student: { $in: studentIds } }).populate('student', 'name').sort('-createdAt');
        } else if (user.role === 'Mentor') {
            const students = await User.find({ mentor: user._id });
            const studentIds = students.map(s => s._id);
            leaves = await Leave.find({ student: { $in: studentIds } }).populate('student', 'name').sort('-createdAt');
        } else if (user.role === 'Warden') {
            const students = await User.find({ isHosteller: true });
            const studentIds = students.map(s => s._id);
            leaves = await Leave.find({ student: { $in: studentIds } }).populate('student', 'name roomNumber').sort('-createdAt');
        } else if (user.role === 'HoD') {
            const students = await User.find({ department: user.department });
            const studentIds = students.map(s => s._id);
            leaves = await Leave.find({ student: { $in: studentIds } }).populate('student', 'name cgpa attendance').sort('-createdAt');
        }

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { applyLeave, approveLeave, getLeaves };
