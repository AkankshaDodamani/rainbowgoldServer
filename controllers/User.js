import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const Login = async (req, res) => {
  let response = {success: false, message: "", errMessage: ""};

  const body = req.body;

  try {
    const user = await User.findOne({ username: body.username });

    if (!user) {
        response.success = false;
        response.message = "User not found";
        response.errMessage = "User not found";
        return res.status(404).json(response);
    }

    // Add authentication logic here
    const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash);
    
    if (!isPasswordValid) {
      response.success = false;
      response.message = "Invalid password";
      response.errMessage = "Invalid password";
      return res.status(401).json(response);
    }
    if (!user.hasAccess) {
      response.success = false;
      response.message = "User does not have access";
      response.errMessage = "User does not have access";
      return res.status(403).json(response);
    }
    response.success = true;
    response.message = "Login successful";
    response.errMessage = "";
    return res.status(200).json(response);
  } 
  catch (error) {
    response.success = false;
    response.message = "Failed to Login!!";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export default Login;