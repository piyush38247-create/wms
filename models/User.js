const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
//   role: { type: String, default: 'staff' } // admin/staff
}, { timestamps: true });

userSchema.methods.matchPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('users', userSchema);
