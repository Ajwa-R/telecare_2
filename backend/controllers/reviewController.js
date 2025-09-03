const Review = require("../models/Review");

exports.create = async (req, res) => {
  try {
    const { rating, text, city = "" } = req.body;
    if (!rating || !text)
      return res.status(400).json({ message: "rating & text required" });
    if (req.user.role === 'admin') return res.status(403).json({ message: 'Admins cannot post reviews' });

    const r = await Review.create({
      byUserId: req.user._id,
      role: req.user.role === "doctor" ? "doctor" : "patient",
      name: req.user.name || "User",
      city,
      rating,
      text,
      approved: false, // admin will approve
    });
    res.status(201).json(r);
  } catch (e) {
    console.error("review.create", e);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

exports.publicList = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 8, 50);
    const role =
      req.query.role && ["patient", "doctor"].includes(req.query.role)
        ? req.query.role
        : undefined;

    const q = { approved: true };
    if (role) q.role = role;

    const list = await Review.find(q).sort("-createdAt").limit(limit).lean();
    const avg = await Review.aggregate([
      { $match: q },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    res.json({ items: list, stats: avg[0] || { avg: 0, count: 0 } });
  } catch (e) {
    console.error("review.publicList", e);
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

exports.adminList = async (_req, res) => {
  try {
    const list = await Review.find({}).sort("-createdAt").lean();
    res.json(list);
  } catch {
    res.status(500).json({ message: "Failed to load admin reviews" });
  }
};

exports.approve = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Review.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!r) return res.status(404).json({ message: "Not found" });
    res.json(r);
  } catch {
    res.status(500).json({ message: "Failed to approve" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Review.findByIdAndDelete(id);
    if (!r) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ message: "Failed to delete" });
  }
};

exports.unapprove = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await Review.findByIdAndUpdate(
      id,
      { approved: false },
      { new: true }
    );
    if (!r) return res.status(404).json({ message: "Not found" });
    res.json(r);
  } catch {
    res.status(500).json({ message: "Failed to unapprove" });
  }
};
