const db = require('../config/db');

const Parking = {
    exists: async (parkingLotId) => {
        const [rows] = await db.execute(
            'SELECT COUNT(*) AS count FROM ParkingLot WHERE id = ?',
            [parkingLotId]
        );
        return rows[0].count > 0;
    },

    getCapacity: async (parkingLotId) => {
        const [rows] = await db.execute(
            'SELECT capacity FROM ParkingLot WHERE id = ?',
            [parkingLotId]
        );
        return rows[0]?.capacity;
    },

    updateCapacity: async (parkingLotId, increment) => {
        return db.execute(
            'UPDATE ParkingLot SET capacity = capacity + ? WHERE id = ?',
            [increment, parkingLotId]
        );
    },
};

module.exports = Parking;