/*const ParkingLot = require('../models/parkingLotModel');
const Record = require('../models/recordModel');

const AccessController = {
  registerAccess: async (req, res) => {
    try {
      const { vehicleId, parkingLotId, type } = req.body;

      // Validate access type (Entry or Exit)
      if (!['Entry', 'Exit'].includes(type)) {
        return res.status(400).json({ message: 'Invalid access type' });
      }

      // Check capacity for Entry
      if (type === 'Entry') {
        const capacity = await ParkingLot.getCapacity(parkingLotId);
        if (capacity <= 0) {
          return res.status(400).json({ message: 'The parking lot is full' });
        }
      }

      // Check conflicts with existing records
      const lastRecord = await Record.getLastRecord(vehicleId);
      if (type === 'Entry' && lastRecord?.type === 'Entry') {
        return res.status(400).json({ message: 'The vehicle is already in the parking lot' });
      }
      if (type === 'Exit' && (!lastRecord || lastRecord.type === 'Exit')) {
        return res.status(400).json({ message: 'The vehicle is not in the parking lot' });
      }

      // Register the access
      await Record.registerEntryExit(vehicleId, parkingLotId, type);

      // Update parking capacity
      const increment = type === 'Entry' ? -1 : 1;
      await ParkingLot.updateCapacity(parkingLotId, increment);

      res.status(200).json({ message: `Registration of ${type} successful` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AccessController;*/
const Parking = require('../models/parkingLotModel');
const Registration = require('../models/recordModel');
const Vehicle = require('../models/vehicleModel'); // Nuevo: para validar vehículos

const AccessController = {
    registerAccess: async (req, res) => {
        try {
            const { vehicleId, parkingLotId, type } = req.body;

            // Validate access type (Entry or Exit)
            if (!['Entry', 'Exit'].includes(type)) {
                return res.status(400).json({ message: 'Invalid access type' });
            }

            // Validate vehicle existence
            const vehicleExists = await Vehicle.exists(vehicleId);
            if (!vehicleExists) {
                return res.status(404).json({ message: 'Vehicle does not exist' });
            }

            // Validate parking lot existence
            const parkingExists = await Parking.exists(parkingLotId);
            if (!parkingExists) {
                return res.status(404).json({ message: 'Parking lot does not exist' });
            }

            // Validate capacity if it is Entry
            if (type === 'Entry') {
                const capacity = await Parking.getCapacity(parkingLotId);
                if (capacity <= 0) {
                    return res.status(400).json({ message: 'The parking lot is full' });
                }
            }

            // Validate that there is no conflict in records
            const lastRegistration = await Registration.getLastRecord(vehicleId);
            if (type === 'Entry' && lastRegistration?.type === 'Entry') {
                return res.status(400).json({ message: 'The vehicle is already in the parking lot' });
            }
            if (type === 'Exit' && (!lastRegistration || lastRegistration.type === 'Exit')) {
                return res.status(400).json({ message: 'The vehicle is not in the parking lot' });
            }

            // Register access
            await Registration.registerEntryExit(vehicleId, parkingLotId, type);

            // Update parking capacity
            const increment = type === 'Entry' ? -1 : 1;
            await Parking.updateCapacity(parkingLotId, increment);

            res.status(200).json({ message: `Registration of ${type} successful` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = AccessController;
