const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";


// ================= REGISTER =================
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const u = new User({
      email,
      password,
      role: "user"
    });

    await u.save();

    const token = jwt.sign(
      { id: u._id, role: u.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({
      token,
      user: { id: u._id, email: u.email, role: u.role }
    });
  } catch (err) {
    next(err);
  }
};


// ================= LOGIN =================
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const u = await User.findOne({ email }).select("+password");

    if (!u) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const ok = await u.comparePassword(password);
    if (!ok) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: u._id, role: u.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      token,
      user: { id: u._id, email: u.email, role: u.role }
    });
  } catch (err) {
    next(err);
  }
};

