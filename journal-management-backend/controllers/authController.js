// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @route   POST /api/auth/register
// @desc    Register user (default role: author)
// @access  Public
exports.register = async (req, res) => {
  const {
    name,
    email,
    password,
    affiliation
  } = req.body;

  try {
    let user = await User.findOne({
      email
    });

    if (user) {
      return res.status(400).json({
        msg: 'User already exists'
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      passwordHash,
      affiliation,
      role: 'author' // Default role
    });

    await user.save();

    // Create and sign the JWT
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
  const {
    email,
    password
  } = req.body;

  try {
    let user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    // Compare submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        msg: 'Invalid Credentials'
      });
    }

    // Create and sign the JWT
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};