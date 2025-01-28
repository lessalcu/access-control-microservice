const axios = require('axios'); // Usaremos Axios para consumir APIs
const Record = require('../models/recordModel');

const AccessController = {
  registerAccess: async (req, res) => {
    try {
      const { vehicleId, parkingLotId, type } = req.body;

      // Validate the access type
      if (!['Entry', 'Exit'].includes(type)) {
        return res.status(400).json({ message: 'Invalid access type' });
      }

      // Validate the vehicle using the vehicle service
      //const vehicleResponse = await axios.get(`http://vehicle-service/vehicle/${vehicleId}`);
      const vehicleResponse = await axios.get(`http://localhost:3003/vehicle/${vehicleId}`);
      if (!vehicleResponse.data) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      // Validate the parking lot using the parking service
      const parkingLotResponse = await axios.get(`http://parking-service/api/parkingLots/${parkingLotId}`);
      if (!parkingLotResponse.data) {
        return res.status(404).json({ message: 'Parking lot not found' });
      }

      const parkingLot = parkingLotResponse.data;

      // If the type is Entry, check parking lot capacity
      if (type === 'Entry' && parkingLot.capacity <= 0) {
        return res.status(400).json({ message: 'The parking lot is full' });
      }

      // Validate vehicle's last record
      const lastRecord = await Record.getLastRegistration(vehicleId);
      if (type === 'Entry' && lastRecord?.type === 'Entry') {
        return res.status(400).json({ message: 'The vehicle is already in the parking lot' });
      }
      if (type === 'Exit' && (!lastRecord || lastRecord.type === 'Exit')) {
        return res.status(400).json({ message: 'The vehicle is not in the parking lot' });
      }

      // Register the Entry/Exit
      await Record.registerEntryExit(vehicleId, parkingLotId, type);

      // Adjust the parking lot capacity
      const capacityUpdate = type === 'Entry' ? -1 : 1;
      await axios.patch(`http://parking-service/api/parkingLots/${parkingLotId}/updateCapacity`, {
        adjustment: capacityUpdate,
      });

      res.status(200).json({ message: `Registration of ${type} successful` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },
};

module.exports = AccessController;