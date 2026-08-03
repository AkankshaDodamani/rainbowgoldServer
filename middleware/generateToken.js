import jwt from "jsonwebtoken";

// 1. Creates a short-lived Access Token
export const createAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      hasAccess: user.hasAccess 
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // Expires in 15 minutes
  );
};

// 2. Creates a long-lived Refresh Token
export const createRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      hasAccess: user.hasAccess 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Expires in 7 days
  );
};

// 3. Middleware to verify the Access Token on protected routes
export const verifyToken = (req, res, next) => {
  let response = { success: false, message: "", errMessage: "" };
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using your specific ACCESS_TOKEN_SECRET
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Ensure the user's access hasn't been revoked
      if (!decoded.hasAccess) {
        response.success = false;
        response.message = "Access denied";
        response.errMessage = "User does not have permission to perform this action";
        return res.status(403).json(response);
      }

      // Attach the decoded payload to the request object
      req.user = decoded;
      
      // Token is valid, proceed to the controller
      next();
    } catch (error) {
      response.success = false;
      response.message = "Authentication failed";
      response.errMessage = "Not authorized, token failed or expired";
      return res.status(401).json(response);
    }
  } 
  
  // If no token was found in the header at all
  if (!token) {
    response.success = false;
    response.message = "Authentication failed";
    response.errMessage = "Not authorized, no token provided";
    return res.status(401).json(response);
  }
};