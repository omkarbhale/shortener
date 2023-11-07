const mongoose = require("mongoose");

const Url = mongoose.Schema({
	originalUrl: {
		type: String,
		required: true,
	},
	shortUrl: {
		type: String,
		required: true,
	},
	lastAccessed: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Url", Url);
