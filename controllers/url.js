const Url = require("../models/Url.js");
const { standardizeURL, generateShortUrl } = require("../utils/url.js");

const serveHome = async (req, res, next) => {
	try {
        return res.render("../views/index");
    } catch (error) {
        next(error);
    }
};

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
			return res.render("../views/link", {
				isNew: false,
				originalUrl: existingEntry.originalUrl,
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

		return res.render("../views/link", {
			isNew: true,
			originalUrl: standardizedURL,
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

module.exports = { serveHome, shortenUrl, navigateTo };
