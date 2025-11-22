const Donor = require("../models/Donor");
const NGO = require("../models/NGO_Modal");
const { sendEmailToNGOs } = require("../utils/email");

// Register donor and notify nearby NGOs
exports.registerDonor = async (req, res) => {
  try {
    const { lat, lon, ...rest } = req.body;

    // Validate coordinates
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const donor = new Donor({
      ...rest,
      location: { type: "Point", coordinates: [Number(lon), Number(lat)] }
    });
    await donor.save();

    // Send email to nearby NGOs
    await sendEmailToNGOs(Number(lat), Number(lon), donor);

    res.status(201).json({ message: "Donor registered & NGOs notified", donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering donor" });
  }
};
