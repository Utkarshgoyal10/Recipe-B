const fetch = require('node-fetch');

async function fetchNominatim(url) {
  const userAgent = process.env.USER_AGENT || 'NGO-Map-App/1.0 (your-email@example.com)';
  const res = await fetch(url, { headers: { 'User-Agent': userAgent } });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  return await res.json();
}

module.exports = fetchNominatim;
