const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getStats,
  getUsers,
  deleteUser,
  getRegionAnalytics,
  getCropAnalytics,
  getDiseaseAnalytics,
  getActivityLogs,
  getCropSeasonAnalytics,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/analytics/regions', getRegionAnalytics);
router.get('/analytics/crops', getCropAnalytics);
router.get('/analytics/diseases', getDiseaseAnalytics);
router.get('/analytics/crop-seasons', getCropSeasonAnalytics);
router.get('/activity', getActivityLogs);

module.exports = router;
