const NGO = require("../models/NGO_Modal"); // make sure file name matches

// Register NGO
exports.registerNGO = async (req, res) => {
  try {
    const { lat, lon, ...rest } = req.body;
    if (!lat || !lon) return res.status(400).json({ message: "Latitude & Longitude required" });

    const ngo = new NGO({
      ...rest,
      location: { type: "Point", coordinates: [Number(lon), Number(lat)] }
    });

    await ngo.save();
    res.status(201).json({ message: "NGO registered successfully", ngo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering NGO" });
  }
};

// Get nearby NGOs
exports.getNearbyNGOs = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: "Latitude & Longitude required" });

    const ngos = await NGO.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
          $maxDistance: 10000 // 10km
        }
      }
    });

    res.json({ ngos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching nearby NGOs" });
  }
};
