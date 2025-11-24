const express = require("express");
const { body, query } = require("express-validator");
const Property = require("../models/Property");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/properties
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 200 }).toInt(),
  ],
  validate,
  async (req, res) => {
    try {
      const { location, beds, bedrooms, type, sort } = req.query;

      const page = req.query.page || 1;
      const limit = req.query.limit || 9;

      const filter = {};

      // LOCATION: search in location/city/state (case-insensitive)
      if (location) {
        const loc = location.trim();
        filter.$or = [
          { location: { $regex: loc, $options: "i" } },
          { city: { $regex: loc, $options: "i" } },
          { state: { $regex: loc, $options: "i" } },
        ];
      }

      // TYPE: e.g. "apartment", "duplex"
      if (type) {
        filter.type = { $regex: type.trim(), $options: "i" };
      }

      // BEDROOMS: support either ?bedrooms=3 or ?beds=3
      const bedValue = bedrooms ?? beds;
      if (bedValue !== undefined && bedValue !== "") {
        const bedNum = Number(bedValue);
        if (!Number.isNaN(bedNum)) {
          filter.bedrooms = bedNum;
        }
      }

      // SORTING
      let sortOption = { createdAt: -1 };

      if (sort === "price-asc") {
        sortOption = { priceValue: 1 };
      } else if (sort === "price-desc") {
        sortOption = { priceValue: -1 };
      }

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Property.find(filter).sort(sortOption).skip(skip).limit(limit),
        Property.countDocuments(filter),
      ]);

      res.json({
        data: items,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("Error getting properties:", err);
      res.status(500).json({
        message: "Failed to fetch properties. Please try again.",
      });
    }
  }
);


module.exports = router;
