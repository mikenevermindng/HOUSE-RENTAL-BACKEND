// const { model } = require("../models/UserModel");
const Users = require("../models/UserModel");

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
    // VALIDATE THE DATA

    // Checking if the user is already in the database
    const emailExist = await Users.findOne({ email });
    if (emailExist) return res.status(400).send("Email already exists");
    console.log(emailExist);
    // Hash password

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
    const users = new Users({
      email,
      password,
    });

    // Validate

    // Checking if the email is not exist
    const emailExist = await Users.findOne(email);
    if (!emailExist) return res.status(400).send("Email or password is wrong");

    // Checking Password is correct

    //Success
    res.send("Logged in...");
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = new Users({
      email,
      password,
    });

    // Validate

    // Checking if the email is not exist
    const emailExist = await Users.findOne(email);
    if (!emailExist) return res.status(400).send("Email or password is wrong");

    // Checking Password is correct

    //Success
    res.delete(users);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
};
