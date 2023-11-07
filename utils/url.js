const url = require("url");

function standardizeURL(inputURL) {
	// Check if the input URL has a protocol; if not, default to 'https'.
	if (!inputURL.startsWith("http://") && !inputURL.startsWith("https://")) {
		inputURL = "https://" + inputURL;
	}

	// Use url.parse() and url.format() to standardize the URL as shown in the previous answer.
	const parsedURL = url.parse(inputURL);
	const standardizedURL = url.format(parsedURL);

	return standardizedURL;
}

function generateShortUrl() {
	return Math.random().toString(36).substring(2, 8);
}

module.exports = { standardizeURL, generateShortUrl };
