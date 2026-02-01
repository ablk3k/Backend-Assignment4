const express = require("express");
const { body } = require("express-validator");
const authCtrl = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().isLength({ min: 6 }),
  authCtrl.register
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  authCtrl.login
);

module.exports = router;
