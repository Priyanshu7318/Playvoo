const User = require('../models/User');

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

exports.subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id }
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 }
    });
    res.status(200).json("Subscription successful.");
  } catch (err) {
    next(err);
  }
};

exports.unsubscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id }
    });
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 }
    });
    res.status(200).json("Unsubscription successful.");
  } catch (err) {
    next(err);
  }
};
