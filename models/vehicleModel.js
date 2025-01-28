const db = require('../config/db');

const Vehicle = {
    exists: async (vehicleId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) AS count FROM Cars WHERE id = ?',
            [vehicleId]
        );
        return rows[0].count > 0;
    },
};

module.exports = Vehicle;