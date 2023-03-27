const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/signup", userController.SignUp);

router.post("/signin", userController.SignIn);

router.post('/verify', userController.VerifyAccount);

router.post('resend-verification', userController.ResendVerification);

module.exports = router;