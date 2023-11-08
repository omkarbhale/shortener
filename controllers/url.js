const Url = require("../models/Url.js");
const url = require("url");
const { standardizeURL, generateShortUrl } = require("../utils/url.js");

const shortenUrl = async (req, res, next) => {
	try {
        const url = req.query.url;
        if (url == null) {
            return res.status(400).json({ error: "No URL provided" });
        }

		const standardizedURL = standardizeURL(url);

		const existingEntry = await Url.findOne({
			originalUrl: standardizedURL,
		});
		if (existingEntry != null) {
			return res.render("../public/index", {
				isNew: false,
				url: existingEntry.shortUrl,
			});
		}

		let shortUrl;
		let tries = 0;
		do {
			shortUrl = generateShortUrl();
			tries++;
		} while ((await Url.findOne({ shortUrl })) && tries < 10);

		if (!shortUrl) {
			return res.status(500).json({ error: "Could not shorten URL" });
		}

		const newEntry = new Url({
			originalUrl: standardizedURL,
			shortUrl,
		});
		await newEntry.save();

		return res.render("../public/index", {
			isNew: true,
			url: newEntry.shortUrl,
		});
	} catch (error) {
		next(error);
	}
};

const navigateTo = async (req, res, next) => {
	try {
		const shortened = req.params.shortened;
		const existingEntry = await Url.findOne({ shortUrl: shortened });
		
		if (!existingEntry) {
			return res.status(404).json({ error: "URL not found" });
		}
        
		res.redirect(existingEntry.originalUrl);
	} catch (error) {
		next(error);
	}
};

module.exports = { shortenUrl, navigateTo };
