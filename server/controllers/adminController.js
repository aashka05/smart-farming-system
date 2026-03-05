const pool = require('../config/db');

// @desc    Get platform summary statistics
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const [usersRes, detectionsRes, chatsRes] = await Promise.all([
      pool.query('SELECT COUNT(*) AS count FROM farmers'),
      pool.query('SELECT COUNT(*) AS count FROM disease_detections'),
      pool.query('SELECT COUNT(*) AS count FROM chatbot_logs'),
    ]);

    // New users in last 7 days
    const recentUsersRes = await pool.query(
      "SELECT COUNT(*) AS count FROM farmers WHERE created_at >= NOW() - INTERVAL '7 days'"
    );

    res.json({
      totalUsers: parseInt(usersRes.rows[0].count, 10),
      totalDetections: parseInt(detectionsRes.rows[0].count, 10),
      totalChats: parseInt(chatsRes.rows[0].count, 10),
      newUsersLast7Days: parseInt(recentUsersRes.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Admin getStats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users?page=1&limit=20&search=
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    const search = req.query.search ? `%${req.query.search}%` : null;

    let countQuery = 'SELECT COUNT(*) AS count FROM farmers';
    let dataQuery =
      'SELECT id, full_name, email, phone, role, created_at FROM farmers';
    const params = [];

    if (search) {
      const whereClause = ' WHERE full_name ILIKE $1 OR email ILIKE $1';
      countQuery += whereClause;
      dataQuery += whereClause;
      params.push(search);
    }

    dataQuery += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const [countRes, dataRes] = await Promise.all([
      pool.query(countQuery, search ? [search] : []),
      pool.query(dataQuery, params),
    ]);

    const total = parseInt(countRes.rows[0].count, 10);

    res.json({
      users: dataRes.rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const result = await pool.query('DELETE FROM farmers WHERE id = $1 RETURNING id, email', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Admin deleteUser error:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// @desc    Get region-wise analytics (users & fields per state)
// @route   GET /api/admin/analytics/regions
// @access  Admin
const getRegionAnalytics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(f.state, 'Unknown') AS region,
        COUNT(DISTINCT f.farmer_id) AS farmers,
        COUNT(f.id) AS fields,
        COALESCE(SUM(f.area_hectares), 0) AS total_area
      FROM fields f
      GROUP BY f.state
      ORDER BY fields DESC
      LIMIT 15
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Admin getRegionAnalytics error:', error);
    res.status(500).json({ message: 'Failed to fetch region analytics', error: error.message });
  }
};

// @desc    Get crop/field analytics
// @route   GET /api/admin/analytics/crops
// @access  Admin
const getCropAnalytics = async (req, res) => {
  try {
    // Soil type distribution across fields
    const soilResult = await pool.query(`
      SELECT
        COALESCE(soil_type, 'Unknown') AS soil_type,
        COUNT(*) AS count
      FROM fields
      GROUP BY soil_type
      ORDER BY count DESC
    `);

    // Monthly field registrations (last 12 months)
    const monthlyResult = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM fields
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month
    `);

    // Top cities by number of fields
    const citiesResult = await pool.query(`
      SELECT
        COALESCE(city_name, 'Unknown') AS city,
        COUNT(*) AS fields
      FROM fields
      GROUP BY city_name
      ORDER BY fields DESC
      LIMIT 10
    `);

    res.json({
      soilDistribution: soilResult.rows,
      monthlyRegistrations: monthlyResult.rows,
      topCities: citiesResult.rows,
    });
  } catch (error) {
    console.error('Admin getCropAnalytics error:', error);
    res.status(500).json({ message: 'Failed to fetch crop analytics', error: error.message });
  }
};

// @desc    Get disease detection analytics
// @route   GET /api/admin/analytics/diseases
// @access  Admin
const getDiseaseAnalytics = async (req, res) => {
  try {
    // Disease frequency
    const diseaseFreq = await pool.query(`
      SELECT
        COALESCE(detected_disease, 'Unknown') AS disease,
        COUNT(*) AS count,
        ROUND(AVG(confidence_score)::numeric, 2) AS avg_confidence
      FROM disease_detections
      GROUP BY detected_disease
      ORDER BY count DESC
      LIMIT 15
    `);

    // Detection trend (last 12 months)
    const trendResult = await pool.query(`
      SELECT
        TO_CHAR(detected_at, 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM disease_detections
      WHERE detected_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(detected_at, 'YYYY-MM')
      ORDER BY month
    `);

    res.json({
      diseaseFrequency: diseaseFreq.rows,
      detectionTrend: trendResult.rows,
    });
  } catch (error) {
    console.error('Admin getDiseaseAnalytics error:', error);
    res.status(500).json({ message: 'Failed to fetch disease analytics', error: error.message });
  }
};

// @desc    Get recent platform activity
// @route   GET /api/admin/activity?limit=30
// @access  Admin
const getActivityLogs = async (req, res) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 30));

    // Recent chatbot interactions
    const chats = await pool.query(
      `SELECT cl.id, f.full_name AS user_name, cl.question, cl.created_at,
              'chat' AS type
       FROM chatbot_logs cl
       LEFT JOIN farmers f ON f.id = cl.farmer_id
       ORDER BY cl.created_at DESC
       LIMIT $1`,
      [limit]
    );

    // Recent disease detections
    const detections = await pool.query(
      `SELECT dd.id, f2.full_name AS user_name, dd.detected_disease, dd.confidence_score, dd.detected_at AS created_at,
              'detection' AS type
       FROM disease_detections dd
       LEFT JOIN farmers f2 ON f2.id = dd.farmer_id
       ORDER BY dd.detected_at DESC
       LIMIT $1`,
      [limit]
    );

    // Recent user registrations
    const registrations = await pool.query(
      `SELECT id, full_name AS user_name, email, created_at,
              'registration' AS type
       FROM farmers
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    // Merge & sort by time
    const all = [
      ...chats.rows,
      ...detections.rows,
      ...registrations.rows,
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(all.slice(0, limit));
  } catch (error) {
    console.error('Admin getActivityLogs error:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs', error: error.message });
  }
};

// @desc    Get crop season analytics (most grown crops by season based on field creation dates & soil types)
// @route   GET /api/admin/analytics/crop-seasons
// @access  Admin
const getCropSeasonAnalytics = async (req, res) => {
  try {
    // Map soil types to likely crops by season based on Indian agriculture
    // We derive season from field creation month and use soil_type to infer likely crops
    const result = await pool.query(`
      SELECT
        CASE
          WHEN EXTRACT(MONTH FROM f.created_at) IN (3,4,5,6) THEN 'Summer (Zaid)'
          WHEN EXTRACT(MONTH FROM f.created_at) IN (7,8,9,10) THEN 'Monsoon (Kharif)'
          WHEN EXTRACT(MONTH FROM f.created_at) IN (11,12,1,2) THEN 'Winter (Rabi)'
        END AS season,
        f.soil_type,
        COUNT(*) AS field_count,
        COALESCE(f.state, 'Unknown') AS state
      FROM fields f
      WHERE f.soil_type IS NOT NULL
      GROUP BY season, f.soil_type, f.state
      ORDER BY field_count DESC
    `);

    // Aggregate by season with top soil types (proxy for crop types)
    const seasonSoil = await pool.query(`
      SELECT
        CASE
          WHEN EXTRACT(MONTH FROM created_at) IN (3,4,5,6) THEN 'Summer (Zaid)'
          WHEN EXTRACT(MONTH FROM created_at) IN (7,8,9,10) THEN 'Monsoon (Kharif)'
          WHEN EXTRACT(MONTH FROM created_at) IN (11,12,1,2) THEN 'Winter (Rabi)'
        END AS season,
        soil_type,
        COUNT(*) AS count
      FROM fields
      WHERE soil_type IS NOT NULL
      GROUP BY season, soil_type
      ORDER BY season, count DESC
    `);

    // Monthly field creation trend
    const monthlyTrend = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*) AS fields,
        CASE
          WHEN EXTRACT(MONTH FROM created_at) IN (3,4,5,6) THEN 'Summer'
          WHEN EXTRACT(MONTH FROM created_at) IN (7,8,9,10) THEN 'Monsoon'
          WHEN EXTRACT(MONTH FROM created_at) IN (11,12,1,2) THEN 'Winter'
        END AS season
      FROM fields
      WHERE created_at >= NOW() - INTERVAL '24 months'
      GROUP BY TO_CHAR(created_at, 'YYYY-MM'), EXTRACT(MONTH FROM created_at)
      ORDER BY month
    `);

    res.json({
      seasonDetails: result.rows,
      seasonSoilBreakdown: seasonSoil.rows,
      monthlyTrend: monthlyTrend.rows,
    });
  } catch (error) {
    console.error('Admin getCropSeasonAnalytics error:', error);
    res.status(500).json({ message: 'Failed to fetch crop season analytics', error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  deleteUser,
  getRegionAnalytics,
  getCropAnalytics,
  getDiseaseAnalytics,
  getActivityLogs,
  getCropSeasonAnalytics,
};
