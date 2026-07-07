const router = require('express').Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// GET /api/user/preferences
router.get('/preferences', auth, (req, res) => {
  res.json({ preferences: req.user.preferences });
});

// PUT /api/user/preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const allowed = ['uiLanguage', 'newsLanguage', 'edition', 'area', 'newspaper', 'keywords'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[`preferences.${key}`] = req.body[key];
    });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );
    res.json({ preferences: user.preferences });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/user/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email },
      { new: true }
    );
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/user/password
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: 'All fields are required' });
    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: 'New passwords do not match' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(oldPassword)))
      return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
