const express = require('express');
const router = express.Router();
const { applyLeave, approveLeave, getLeaves } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, applyLeave).get(protect, getLeaves);
router.route('/:id/approve').put(protect, approveLeave);

module.exports = router;
