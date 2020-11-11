// const { model } = require("../models/UserModel");
const Owners = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const jwt = require('jsonwebtoken');

module.exports.register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    citizenId,
    address,
  } = req.body;
  const owners = new Owners({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    citizenId,
    address,
  });

  try {
    // Checking if the owner is already in the database
    const emailExist = await Owners.findOne({ email });
    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });
    console.log(emailExist);

    // Hash password
    const hashPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
    console.log(password);
    owners.password = hashPassword;
    // Create a new user
    const savedOwner = await owners.save();
    res.send(savedOwner);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Checking if the email is not exist
    const owner = await Owners.findOne({ email });
    if (!owner) res.status(400).json({ message: "Email or password is wrong" });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, owner.password);
    console.log(validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "Email or password is wrong" });
      return;
    }

    //Success
    res.json({
      owner,
      message: "Logged in...",
    });
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};

module.exports.deleteOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.params;

    // Checking if the email is not exist
    const owner = await Owners.findOne({ _id: ownerId });
    console.log(owner);

    if (!owner) return res.status(400).json({
      message: "Email or password is wrong"
    });

    //Success
    await owner.remove();
    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};
