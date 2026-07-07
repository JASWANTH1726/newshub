const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const preferencesSchema = new mongoose.Schema({
  uiLanguage:   { type: String, default: 'en' },
  newsLanguage: { type: String, default: 'en' },
  edition:      { type: String, default: 'digital' },
  area:         { type: String, default: 'national' },
  newspaper:    { type: String, default: 'the_hindu' },
  keywords:     { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:    { type: String, required: true, minlength: 6 },
  preferences: { type: preferencesSchema, default: () => ({}) },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
