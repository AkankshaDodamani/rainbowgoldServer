import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Make sure to import this for the refresh function
import { createAccessToken, createRefreshToken } from "../middleware/generateToken.js";

const Login = async (req, res) => {
  let response = { success: false, message: "", errMessage: "" };

  const body = req.body;

  try {
    const user = await User.findOne({ username: body.username });

    if (!user) {
      response.success = false;
      response.message = "User not found";
      response.errMessage = "User not found";
      return res.status(404).json(response);
    }

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

    // Generate Tokens
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    response.success = true;
    response.message = "Login successful";
    response.errMessage = "";
    
    // Attach user data and tokens to the response
    response.data = {
      user: {
        id: user._id,
        username: user.username,
        hasAccess: user.hasAccess
      }
    };
    response.accessToken = accessToken; 
    response.refreshToken = refreshToken;

    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Failed to Login!!";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

// ==========================================
// NEW REFRESH TOKEN CONTROLLER
// ==========================================
export const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, message: "No refresh token provided" });
  }

  try {
    // 1. Verify the refresh token
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // 2. If valid, issue a new 15-minute access token
    const newAccessToken = createAccessToken({
      _id: decoded.id, // Maps to user._id in your generator
      username: decoded.username,
      hasAccess: decoded.hasAccess,
    });

    return res.status(200).json({ 
      success: true, 
      accessToken: newAccessToken 
    });

  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      errMessage: "Refresh token is invalid or expired" 
    });
  }
};

export default Login;