const { Signup, Login, Logout } = require("../Controllers/AuthController");
const {
  userVerification,
  requireAuth,
} = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

// Auth routes
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

// Protected routes
router.get("/verify", requireAuth, (req, res) => {
  res.status(200).json({
    message: "Token is valid",
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

// Get user profile (protected)
router.get("/profile", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
