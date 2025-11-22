const { google } = require("googleapis");
const dotenv = require("dotenv");
const NGO = require("../models/NGO_Modal");
dotenv.config();

// OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

// Function to send email via Gmail API
const sendEmail = async (to, subject, html) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    const messageParts = [
      `From: "SaveFood" <${process.env.GMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
    ];

    const message = messageParts.join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    console.log(`Email sent to ${to} ✅`);
    return result.data;
  } catch (error) {
    console.error(`Failed to send email to ${to} ❌`, error);
  }
};

// Send email to nearby NGOs
const sendEmailToNGOs = async (lat, lon, donor) => {
  try {
    // Fetch nearby NGOs (adjust radius logic if needed)
    const nearbyNGOs = await NGO.find({
      "location.coordinates.1": { $gte: lat - 0.1, $lte: lat + 0.1 },
      "location.coordinates.0": { $gte: lon - 0.1, $lte: lon + 0.1 },
    });

    if (!nearbyNGOs.length) {
      console.log("No nearby NGOs found");
      return;
    }

for (let ngo of nearbyNGOs) {
  const htmlContent = `
    <h3>New Food Donation Available</h3>
    <p><strong>Donor Name:</strong> ${donor.name}</p>
    <p><strong>Email:</strong> ${donor.email}</p>
    <p><strong>Phone:</strong> ${donor.phone}</p>
    <p><strong>Food / Item:</strong> ${donor.foodItem}</p>
    <p><strong>Quantity:</strong> ${donor.quantity}</p>
    <p><strong>Expiry / Best Before:</strong> ${donor.expiryDate || 'N/A'}</p>

    <h4>Address Details:</h4>
    <p><strong>House:</strong> ${donor.house || 'N/A'}</p>
    <p><strong>Street:</strong> ${donor.street || 'N/A'}</p>
    <p><strong>Town:</strong> ${donor.town || 'N/A'}</p>
    <p><strong>District:</strong> ${donor.district || 'N/A'}</p>
    <p><strong>State:</strong> ${donor.state || 'N/A'}</p>
    <p><strong>Pincode:</strong> ${donor.pincode || 'N/A'}</p>
    <p><strong>Full Address:</strong> ${donor.fullAddress || 'N/A'}</p>

    <p><strong>Location Coordinates:</strong> 
       ${donor.location?.coordinates ? `${donor.location.coordinates[1]}, ${donor.location.coordinates[0]}` : 'N/A'}
    </p>

    <p>Please contact the donor to collect the donation.</p>
  `;

      await sendEmail(ngo.email, `Food Donation Alert from ${donor.name}`, htmlContent);
    }
  } catch (err) {
    console.error("Error in sendEmailToNGOs ❌", err);
  }
};

module.exports = { sendEmail, sendEmailToNGOs };
