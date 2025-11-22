const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  foodItem: { type: String, required: true },
  quantity: { type: String, required: true },
  expiryDate: String,

  house: String,
  street: String,
  town: String,
  district: String,
  state: String,
  pincode: String,
  fullAddress: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number] } // [lon, lat]
  },
}, { timestamps: true });

module.exports = mongoose.model("Donor", donorSchema);
