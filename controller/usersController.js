// const { model } = require("../models/UserModel");
const Users = require('../models/UserModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0//P4$$w0rD';
const jwt = require('jsonwebtoken');
const { ROLE } = require('../Constants/RoleConstant')
// const {registerValidation, loginValidation} = require('../middleware/validation');

module.exports.register = async (req, res, next) => {
  try {
    // Checking if the user is already in the database
    const { email, password } = req.body;
    const emailExist = await Users.findOne({ email });
    if (emailExist) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new Users({ ...req.body, password: hashPassword });
    console.log(user);
    const savedUser = await user.save();
    res.status(200).json({
      savedUser
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Checking if the email is not exist
    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email or password is wrong' });
    }

    //Create and assign a token
    const token = jwt.sign({ userId: user._id, role: ROLE.USER }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      user: { ...user._doc, password: "" },
      token: 'Bearer ' + token
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error', detail: error });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Checking if the email is not exist
    const user = await Users.findOne({ _id: userId });
    console.log(user);

    if (!user) return res.status(400).json({ message: 'Email or password is wrong' });

    //Success
    await user.remove();
    res.json({
      message: 'delete successfully'
    });
  } catch (error) {
    res.status(400).json({ message: 'error' });
  }
};

module.exports.updateAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const { userData } = req;
    if (userData.userId !== userId) {
      return res.status(400).json({ message: 'you are not the owner of this account' });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await Users.findOneAndUpdate({ _id: userId }, { ...req.body, password: hashPassword });

    //Update Password
    res.status(200).json({
      message: 'updated successfully'
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};

module.exports.getAllUser = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json({
      count: users.length,
      users: users
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await Users.findById(userId);
    res.status(200).json({
      user: user
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'error' });
  }
};
