const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const checkAuth = require("../middlewares/checkAuth");

router.post("/login", authController.loginUser);
router.post("/logout", checkAuth, authController.logoutUser);
router.post("/refresh", checkAuth, authController.refreshToken);

module.exports = router;
