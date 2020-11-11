// const { model } = require("../models/UserModel");
const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = asjfhauhrfkdnjafd;

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
  const users = new Users({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    citizenId,
    address,
  });

  try {
    // Checking if the user is already in the database
    const emailExist = await Users.findOne({ email });
    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });
    console.log(emailExist);

    // Hash password
    const hashPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
    console.log(password);
    users.password = hashPassword;

    // Create a new user
    const savedUser = await users.save();
    res.send(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Checking if the email is not exist
    const user = await Users.findOne({ email });
    if (!user) res.status(400).json({ message: "Email or password is wrong" });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "Email or password is wrong" });
      return;
    }
    
    //Create and assign a token 
    const token = jwt.sign({_id: userId}, process.env.TOKEN_SECRET );
    res.header('auth-token', token).json({
      message: token
    });

    //Success
    res.json({
      user,
      message: "Logged in...",
    });
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Checking if the email is not exist
    const user = await Users.findOne({ _id: userId });
    console.log(user);

    if (!user) return res.status(400).json({ message: "Email or password is wrong" });

    //Success
    await user.remove();
    res.json({
      message: "delete successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};

module.exports.updateAccount = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      citizenId,
      address,
    } = req.body;
    const user = await Users.findOne({ _id: userId });

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.citizenId = citizenId;
    user.address = address;
    await user.save();

    //Update Password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashPassword;
    res.json({
      message: "updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};
