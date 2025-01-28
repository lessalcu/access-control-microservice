const axios = require('axios'); // Axios para hacer peticiones a las APIs de otros microservicios
const Record = require('../models/recordModel');

const AccessController = {
  registerAccess: async (req, res) => {
    try {
      const { vehicleId, parkingLotId, type } = req.body;

      // Validar tipo de acceso
      if (!['Entry', 'Exit'].includes(type)) {
        return res.status(400).json({ message: 'Invalid access type' });
      }

      // Validar vehículo y parqueadero usando las APIs locales
      const vehicleResponse = await axios.get(`http://localhost:3003/vehicle/${vehicleId}`);
      //const parkingLotResponse = await axios.get(`http://localhost:3003/vehicle/${vehicleId}`);

      if (!vehicleResponse.data) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      //if (!parkingLotResponse.data) {
       // return res.status(404).json({ message: 'Parking lot not found' });
      // }

      //const parkingLot = parkingLotResponse.data;

      // Si el tipo es Entry, verificar la capacidad del parqueadero
      //if (type === 'Entry' && parkingLot.capacity <= 0) {
        //return res.status(400).json({ message: 'The parking lot is full' });
      //}

      // Verificar el último registro del vehículo
      const lastRecord = await Record.getLastRegistration(vehicleId);
      if (type === 'Entry' && lastRecord?.type === 'Entry') {
        return res.status(400).json({ message: 'The vehicle is already in the parking lot' });
      }
      if (type === 'Exit' && (!lastRecord || lastRecord.type === 'Exit')) {
        return res.status(400).json({ message: 'The vehicle is not in the parking lot' });
      }

      // Registrar el acceso (Entrada/Salida)
      await Record.registerEntryExit(vehicleId, parkingLotId, type);

      // Ajustar la capacidad del parqueadero (simulación de actualización)
      //const capacityUpdate = type === 'Entry' ? -1 : 1;
      //await axios.patch(`http://localhost:3002/parkingLot/${parkingLotId}/updateCapacity`, {
//        adjustment: capacityUpdate,
  //    });

      res.status(200).json({ message: `Registration of ${type} successful` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  },
};

module.exports = AccessController;
