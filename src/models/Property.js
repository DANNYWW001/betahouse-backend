const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },

    price: { type: String, required: true },

    priceValue: { type: Number, default: 0 },

    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },

    status: { type: String, enum: ["For Sale", "For Rent"], required: true },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },

    city: { type: String },
    state: { type: String },
    type: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
