const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');

const router = express.Router();

// Mock: send OTP via SMS (in production, use real SMS service like Twilio)
async function sendOtpSms(phone, otp) {
  console.log(`OTP for ${phone}: ${otp}`);
}

// Middleware to check JWT in Authorization header
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Step 1: Request OTP
router.post('/request-otp', async (req, res) => {
  const schema = z.object({ phone: z.string().min(8) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone } = parse.data;
  try {
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
    } else {
      user.isPhoneVerified = false; // Reset if previously verified
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    await sendOtpSms(phone, otp);
    res.json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error requesting OTP', error: err.message });
  }
});

// Step 2: Verify OTP
router.post('/verify-otp', async (req, res) => {
  const schema = z.object({ phone: z.string().min(8), otp: z.string().length(6) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone, otp } = parse.data;
  try {
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
        // redirect: '/request-otp'
      });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.isPhoneVerified = true;
    await user.save();
    res.json({ message: 'Phone verified. Continue to sign up.', next: '/signup' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Step 3: Complete Signup
router.post('/signup', async (req, res) => {
  const schema = z.object({
    phone: z.string().min(8),
    username: z.string().min(3),
    password: z.string().min(6),
    password_confirmation: z.string().min(6)
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone, username, password, password_confirmation } = parse.data;
  if (password !== password_confirmation)
    return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const user = await User.findOne({ phone, isPhoneVerified: true });
    if (!user) return res.status(400).json({ message: 'Phone not verified' });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: 'Registration complete', redirect: '/signup-complete' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const schema = z.object({
    phone: z.string().min(8),
    password: z.string().min(6)
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone, password } = parse.data;
  try {
    const user = await User.findOne({ phone });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (requires Bearer token)
router.post('/logout', authenticateToken, (req, res) => {
  // Invalidate token logic can be added here if using a token blacklist
  res.json({ message: 'Logged out' });
});




// Forgot Password: Request OTP
router.post('/forgot-password', async (req, res) => {
  const schema = z.object({ phone: z.string().min(8) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone } = parse.data;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpSms(phone, otp);
    res.json({ message: 'OTP sent via SMS' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password using OTP
router.post('/reset-password', async (req, res) => {
  const schema = z.object({
    phone: z.string().min(8),
    otp: z.string().length(6),
    newPassword: z.string().min(6)
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.errors });

  const { phone, otp, newPassword } = parse.data;
  try {
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
