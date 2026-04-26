const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  subscribers: { type: Number, default: 0 },
  subscribedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
