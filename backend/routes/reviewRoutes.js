const router = require("express").Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const ctrl = require("../controllers/reviewController");

// submit review (logged-in user)
router.post("/", protect, ctrl.create);

// public feed for landing page
router.get("/public", ctrl.publicList);

// admin moderation
router.get("/admin", protect, requireRole("admin"), ctrl.adminList);
router.patch("/:id/approve", protect, requireRole("admin"), ctrl.approve);
router.patch("/:id/reject", protect, requireRole("admin"), ctrl.unapprove);
router.delete("/:id", protect, requireRole("admin"), ctrl.remove);

module.exports = router;
