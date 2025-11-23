const express = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const User = require("../models/User");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * @route   POST /api/auth/register
 * @desc    Register user
 */
router.post(
  "/register",
  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("repeatPassword")
      .notEmpty()
      .withMessage("Please confirm your password")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  validate,
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login instead." });
    }

    const user = await User.create({ firstName, lastName, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user,
    });
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ message: "Login successful", token, user });
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 */
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
