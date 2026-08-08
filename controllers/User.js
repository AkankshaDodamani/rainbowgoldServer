import User from "../models/user.js";
import bcrypt from "bcrypt";
import {createAccessToken} from "../middleware/generateToken.js";
import {createRefreshToken} from "../middleware/generateToken.js";

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
    response.accessToken = accessToken; // Fixed typo here
    response.refreshToken = refreshToken;

    return res.status(200).json(response);
  } catch (error) {
    response.success = false;
    response.message = "Failed to Login!!";
    response.errMessage = error.message;
    return res.status(500).json(response);
  }
};

export default Login;