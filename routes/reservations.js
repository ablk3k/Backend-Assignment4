const express = require("express");
const { body } = require("express-validator");
const reservationCtrl = require("../controllers/reservationController");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public read
router.get("/", reservationCtrl.list);
router.get("/:id", reservationCtrl.get);

// Admin-only create
router.post(
  "/",
  authenticate,
  requireAdmin,
  body("name").isString().trim().notEmpty(),
  body("phone").isString().trim().notEmpty(),
  body("date").isString().trim().notEmpty(),
  body("time").isString().trim().notEmpty(),
  body("guests").isInt({ min: 1 }),
  reservationCtrl.create
);

// Admin-only update
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  body("name").optional().isString().trim().notEmpty(),
  body("phone").optional().isString().trim().notEmpty(),
  body("date").optional().isString().trim().notEmpty(),
  body("time").optional().isString().trim().notEmpty(),
  body("guests").optional().isInt({ min: 1 }),
  reservationCtrl.update
);

// Admin-only delete
router.delete("/:id", authenticate, requireAdmin, reservationCtrl.remove);

module.exports = router;
