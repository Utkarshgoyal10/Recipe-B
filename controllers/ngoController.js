const NGO = require("../models/NGO_Modal"); // Make sure file name matches

// =======================
// Register NGO
// =======================
exports.registerNGO = async (req, res) => {
  try {
    const { latitude, longitude, ...rest } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude & Longitude are required" });
    }

    const ngo = new NGO({
      ...rest,
      location: { type: "Point", coordinates: [Number(longitude), Number(latitude)] }
    });

    await ngo.save();

    return res.status(201).json({
      message: "NGO registered successfully",
      ngo
    });
  } catch (err) {
    console.error("Error registering NGO:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =======================
// Get Nearby NGOs
// =======================
exports.getNearbyNGOs = async (req, res) => {
  try {
    const { latitude, longitude, maxDistanceKm = 10 } = req.query;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude & Longitude are required" });
    }

    // Convert distance to meters
    const maxDistance = Number(maxDistanceKm) * 1000;

    const ngos = await NGO.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: maxDistance
        }
      }
    });

    return res.json({ ngos });
  } catch (err) {
    console.error("Error fetching nearby NGOs:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
