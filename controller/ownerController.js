// const { model } = require("../models/UserModel");
const Owners = require("../models/OwnerModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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
    // Checking if the owner is already in the database
    const emailExist = await Owners.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });
    console.log(emailExist);

    // Hash password
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    console.log(req.body.password, hashPassword);

    // Create a new user
    const owner = new Owners({ ...req.body, password: hashPassword });
    const savedOwner = await owner.save();
    res.status(200).json({
      savedOwner,
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
    const owner = await Owners.findOne({ email });
    if (!owner)
      return res.status(400).json({ message: "Email or password is wrong" });

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, owner.password);
    console.log(validPassword);
    if (!validPassword) {
      res.status(400).json({ message: "Email or password is wrong" });
      return;
    }

    //Create and assign a token
    const { ownerId } = req.params;
    const token = jwt.sign(
      { _id: ownerId, role: "owner" },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({
      token: "Bearer " + token,
      owner: owner,
    });
  } catch (error) {
    res.status(400).json({ message: "error", detail: error });
  }
};

module.exports.deleteOwner = async (req, res, next) => {
  try {
    const { ownerId } = req.params;

    // Checking if the email is not exist
    const owner = await Owners.findOne({ _id: ownerId });
    console.log(owner);

    if (!owner)
      return res.status(400).json({
        message: "Email or password is wrong",
      });

    //Success
    await owner.remove();
    res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "error", detail: error });
  }
};

module.exports.updateAccount = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      citizenId,
      address,
    } = req.body;
    const owner = await Owners.findOne({ _id: ownerId });

    owner.firstName = firstName;
    owner.lastName = lastName;
    owner.email = email;
    owner.phoneNumber = phoneNumber;
    owner.citizenId = citizenId;
    owner.address = address;
    await owner.save();

    //Update Password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    owner.password = hashPassword;
    res.json({
      message: "updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.getAllOwner = async (req, res, next) => {
  try {
    const owners = await Owners.find();
    res.status(200).json({ count: owners.length, owners: owners });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};

module.exports.getOwnerById = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const owner = await Owners.findById(ownerId);
    res.status(200).json({
      owner: owner,
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
        Owner.findOne({ email }).exec((err, owner) => {
          // Find if this email already exists
          if (owner) {
            const token = jwt.sign({ _id: owner._id }, process.env.JWT_SECRET, {
              expiresIn: "7d", // valid token for 7 days
            });
            const { _id, email, name, role } = owner;
            return res.json({
              token,
              owner: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            owner = new Owner({ name, email, password });
            owner.save((err, data) => {
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
                owner: { _id, email, name, role },
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
  const { ownerID, accessToken } = req.body;

  const url = `https://graph.facebook.com/v2.11/${ownerID}/?fields=id,name,email&access_token=${accessToken}`;

  return (
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      // .then(response => console.log(response))
      .then((response) => {
        const { email, name } = response;
        Owner.findOne({ email }).exec((err, owner) => {
          if (owner) {
            const token = jwt.sign({ _id: owner._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = owner;
            return res.json({
              token,
              owner: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            owner = new Owner({ name, email, password });
            owner.save((err, data) => {
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
                owner: { _id, email, name, role },
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
