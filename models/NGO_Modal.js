const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  house: String,
  street: String,
  town: String,
  district: String,
  state: String,
  pincode: String,
  fullAddress: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" } // [lon, lat]
  },
}, { timestamps: true });

module.exports = mongoose.model("NGO", ngoSchema);
