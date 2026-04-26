const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  imgUrl: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  views: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
