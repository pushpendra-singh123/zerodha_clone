const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/UserModel");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const userVerification = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: "Access token is required",
        success: false,
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
          success: false,
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        message: "Invalid or expired token",
        success: false,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Middleware to check if user is authenticated (for protected routes)
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
      success: false,
    });
  }

  userVerification(req, res, next);
};

module.exports = { userVerification, requireAuth };
