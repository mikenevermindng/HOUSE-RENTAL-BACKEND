// const { model } = require("../models/UserModel");
const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const jwt = require("jsonwebtoken");
// const {registerValidation, loginValidation} = require('../middleware/validation');

const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

module.exports.register = async (req, res, next) => {
  // // LET'S VALIDATE DATE BEFORE WE MAKE A USER
  // const {error} = registerValidation(req.body);
  // if(error) return res.status(422).json({
  //   message: 'Validation error.',
  //   error
  // });

  try {
    // Checking if the user is already in the database
    const { email, password } = req.body;
    const emailExist = await Users.findOne({ email });
    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new Users({ ...req.body, password: hashPassword });
    console.log(user);
    const savedUser = await user.save();
    res.status(200).json({
      savedUser,
    });
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
    if (!user)
      return res.status(400).json({ message: "Email or password is wrong" });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Email or password is wrong" });
    }

    //Create and assign a token
    const { userId } = req.params;
    const token = jwt.sign(
      { _id: userId, role: "user" },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({
      token: "Bearer " + token,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error", detail: error });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Checking if the email is not exist
    const user = await Users.findOne({ _id: userId });
    console.log(user);

    if (!user)
      return res.status(400).json({ message: "Email or password is wrong" });

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
      count: users.length,
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await Users.findById(userId);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;

      //Check if email verified
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          // Find if this email already exists
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d", // valid token for 7 days
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};

//Facebook Login
exports.facebookController = (req, res) => {
  console.log("FACEBOOK LOGIN REQ BODY", req.body);
  const { userID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR FACEBOOK LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with facebook",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      })
      .catch((error) => {
        res.json({
          error: "Facebook login failed. Try later",
        });
      })
  );
};
