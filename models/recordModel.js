const db = require('../config/db');

const Record = {
  // Register an Entry/Exit
  registerEntryExit: async (vehicleId, parkingLotId, type) => {
    return db.execute(
      'INSERT INTO RecordEntriesExits (vehicleId, parkingLotId, type) VALUES (?, ?, ?)',
      [vehicleId, parkingLotId, type]
    );
  },

  // Get the last record for a vehicle
  getLastRegistration: async (vehicleId) => {
    const [rows] = await db.execute(
      'SELECT * FROM RecordEntriesExits WHERE vehicleId = ? ORDER BY dateTime DESC LIMIT 1',
      [vehicleId]
    );
    return rows[0];
  },
};

module.exports = Record;
