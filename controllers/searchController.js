const fetchNominatim = require('../utils/fetchNominatim');

// Handle search requests
async function handleSearch(req, res) {
  try {
    const q = req.query.q || '';
    const limit = req.query.limit || 8;
    const cc = req.query.countrycodes ? `&countrycodes=${encodeURIComponent(req.query.countrycodes)}` : '';
    if (!q) return res.json([]);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=${limit}${cc}`;
    const data = await fetchNominatim(url);

    const out = data.map(d => ({
      lat: d.lat,
      lon: d.lon,
      display_name: d.display_name,
      address: d.address || {}
    }));

    res.json(out);
  } catch (err) {
    console.error('Search ctrl err', err);
    res.status(500).json([]);
  }
}

// Handle reverse geocoding
async function handleReverse(req, res) {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat & lon required' });

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=json&addressdetails=1&zoom=18`;
    const data = await fetchNominatim(url);
    res.json({ display_name: data.display_name || '', address: data.address || {} });
  } catch (err) {
    console.error('Reverse ctrl err', err);
    res.status(500).json({});
  }
}

module.exports = { handleSearch, handleReverse };
