const express = require("express");

const router = express.Router();

const { shortenUrl, navigateTo } = require("../controllers/url.js");

const { rateLimit, MemoryStore } = require("express-rate-limit");
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 10, // limit each IP to 10 requests per windowMs
});

router.get("/shorten", limiter, shortenUrl);

router.get("/:shortened", navigateTo);

module.exports = router;
