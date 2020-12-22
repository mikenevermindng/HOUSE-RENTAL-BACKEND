const Owners = require("../models/OwnerModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { ROLE } = require('../Constants/RoleConstant')

module.exports.register = async (req, res, next) => {
  try {
    // Checking if the owner is already in the database
    const emailExist = await Owners.findOne({ email: req.body.email });
    if (emailExist)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user
    const owner = new Owners({ ...req.body, password: hashPassword });
    const savedOwner = await owner.save();
    res.status(200).json({
      savedOwner
    });

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
    if (!owner) return res.status(400).json({ message: "Email or password is wrong" });

    if (!owner.isApproved) return res.status(401).json({ message: "This account was not approved by admin" })

    // Checking Password is correct
    const validPassword = await bcrypt.compare(password, owner.password);
    if (!validPassword) {
      res.status(400).json({ message: "Email or password is wrong" });
      return;
    }

    //Create and assign a token 
    const { ownerId } = req.params;
    const token = jwt.sign({ role: ROLE.OWNER, ...owner._doc, password: '' }, process.env.TOKEN_SECRET);
    res.status(200).json({
      owner: { ...owner._doc, password: '' },
      token: 'Bearer ' + token,
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

    if (!owner) return res.status(400).json({
      message: "Email or password is wrong"
    });
    //Success
    await owner.remove();
    return res.json({
      message: "Delete successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "error", detail: error });
  }
};

module.exports.updateAccount = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const owner = await Owners.findOneAndUpdate({ _id: ownerId }, { ...req.body });
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
    res.status(200).json({ count: owners.length, owners: owners })

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
      owner: owner
    })

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error" });
  }
};