const fetch = require("node-fetch");

exports.fetchNomination = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ message: "lat & lon required" });

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching nomination" });
  }
};
