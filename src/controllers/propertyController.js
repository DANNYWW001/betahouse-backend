const Property = require("../models/Property");

// GET /properties
const getProperties = async (req, res) => {
  try {
    let {
      location = "",
      type = "",
      bedrooms = "",
      page = 1,
      limit = 9,
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;

    const query = {};

    // LOCATION FILTER
    if (location.trim()) {
      const loc = location.trim();
      query.$or = [
        { location: { $regex: loc, $options: "i" } },
        { city: { $regex: loc, $options: "i" } },
        { state: { $regex: loc, $options: "i" } },
      ];
    }

    // TYPE FILTER
    if (type.trim()) {
      query.type = { $regex: type.trim(), $options: "i" };
    }

    // BEDROOMS FILTER
    if (bedrooms !== "" && bedrooms !== undefined) {
      const bedsNum = Number(bedrooms);
      if (!Number.isNaN(bedsNum) && bedsNum > 0) {
        query.bedrooms = bedsNum;
      }
    }

    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    return res.json({
      data: properties,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Error fetching properties:", err);
    return res.status(500).json({
      message: "Failed to fetch properties. Please try again later.",
    });
  }
};

module.exports = {
  getProperties,
};
