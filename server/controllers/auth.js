const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Wrong Credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password, ...others } = user._doc;

    res.status(200).json({ token, user: others });
  } catch (err) {
    next(err);
  }
};
