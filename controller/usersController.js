// const { model } = require("../models/UserModel");
const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const jwt = require('jsonwebtoken');
// const {registerValidation, loginValidation} = require('../middleware/validation');

module.exports.register = async (req, res, next) => {

  // // LET'S VALIDATE DATE BEFORE WE MAKE A USER
  // const {error} = registerValidation(req.body);
  // if(error) return res.status(422).json({
  //   message: 'Validation error.',
  //   error
  // });


  try {
    // Checking if the user is already in the database
    const {email, password} = req.body;
    const emailExist = await Users.findOne({ email });
    if (emailExist) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new Users({...req.body, password: hashPassword});
    console.log(user)
    const savedUser = await user.save();
    res.status(200).json({
      savedUser
    })
    

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.login = async (req, res, next) => {

  // // LET'S VALIDATE DATE BEFORE WE MAKE A USER
  // const {error} = loginValidation(req.body);
  // if(error) return res.status(422).json({
  //   message: 'Validation error.',
  //   error: error
  // });

  try {
    const { email, password } = req.body;

    // Checking if the email is not exist
    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email or password is wrong" });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email or password is wrong" });
    }
    
    //Create and assign a token 
    const { userId } = req.params;
    const token = jwt.sign({_id: userId, role: 'user'}, process.env.TOKEN_SECRET );
    res.status(200).json({
      token: 'Bearer ' +  token,
      user: user
    });

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "error", detail: error });
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

module.exports.getAllUser = async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json({
      count: users.length ,
      users: users
    })
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const user = await Users.findById(userId);
    res.status(200).json({
      user: user
    })
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};