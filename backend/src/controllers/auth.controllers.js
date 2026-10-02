import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async(req, res) => {
    const { email, fullName, password } = req.body;
  try {
    if(!fullName || !email || !password) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    if(password.length < 6) {
       return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    // hash password
    const user = await User.findOne({ email });
    if (user) {
       return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({ _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic});
    }else {
       return res.status(400).json({ error: "Invalid user data" });
    }

  } catch (error) {
    console.error("Error during signup:", error.message);
    return res.status(500).json({ error: "Error during signup" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
