const db = require('../config/db');

const Record = {
  registerEntryExit: async (vehicleId, parkingLotId, type) => {
    return db.execute(
      'INSERT INTO RecordEntriesExits (vehicleId, parkingLotId, type) VALUES (?, ?, ?)',
      [vehicleId, parkingLotId, type]
    );
  },

  getLastRecord: async (vehicleId) => {
    const [rows] = await db.execute(
      'SELECT * FROM RecordEntriesExits WHERE vehicleId = ? ORDER BY dateTime DESC LIMIT 1',
      [vehicleId]
    );
    return rows[0];
  },
};

module.exports = Record;