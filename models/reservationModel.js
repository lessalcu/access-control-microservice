const db = require('../config/db');

const Reservation = {
  getActiveReservation: async (vehicleId) => {
    const [rows] = await db.execute(
      'SELECT * FROM Reservation WHERE vehicleId = ? AND status = "Confirmed" AND NOW() BETWEEN startDate AND endDate',
      [vehicleId]
    );
    return rows[0];
  },

  updateStatus: async (id, newStatus) => {
    return db.execute('UPDATE Reservation SET status = ? WHERE id = ?', [newStatus, id]);
  },
};

module.exports = Reservation;