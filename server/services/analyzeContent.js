// const { google } = require('googleapis');
// const { saveLogInfo } = require('../middlewares/logger/logInfo');
// const Config = require('../models/config.model');

// const analyzeTextWithPerspectiveAPI = async (
// 	content,
// 	API_KEY,
// 	DISCOVERY_URL,
// 	timeout,
// ) => {
// 	const SCORE_THRESHOLD = 0.5;

// 	if (!API_KEY || !DISCOVERY_URL) {
// 		analyzeTextWithPerspectiveAPI;
// 		throw new Error('Perspective API URL or API Key not set');
// 	}

// 	try {
// 		const client = await google.discoverAPI(DISCOVERY_URL);

// 		const analyzeRequest = {
// 			comment: {
// 				text: content,
// 			},
// 			requestedAttributes: {
// 				// SPAM: {},
// 				// UNSUBSTANTIAL: {},
// 				INSULT: {},
// 				PROFANITY: {},
// 				THREAT: {},
// 				SEXUALLY_EXPLICIT: {},
// 				IDENTITY_ATTACK: {},
// 				TOXICITY: {},
// 			},
// 		};

// 		const responsePromise = client.comments.analyze({
// 			key: API_KEY,
// 			resource: analyzeRequest,
// 		});

// 		const timeoutPromise = new Promise((resolve, reject) => {
// 			setTimeout(() => {
// 				reject(new Error('Request timed out'));
// 			}, timeout);
// 		});

// 		const response = await Promise.race([responsePromise, timeoutPromise]);

// 		const summaryScores = {};
// 		for (const attribute in response.data.attributeScores) {
// 			const summaryScore =
// 				response.data.attributeScores[attribute].summaryScore.value;
// 			if (summaryScore >= SCORE_THRESHOLD) {
// 				summaryScores[attribute] = summaryScore;
// 			}
// 		}

// 		return summaryScores;
// 	} catch (error) {
// 		throw new Error(`Error analyzing text: ${error.message}`);
// 	}
// };

// const analyzeContent = async (req, res, next) => {
// 	const timeout = 5000; // 5 seconds
// 	const API_KEY = process.env.PERSPECTIVE_API_KEY;
// 	const DISCOVERY_URL = process.env.PERSPECTIVE_API_DISCOVERY_URL;

// 	let usePerspectiveAPI;
// 	try {
// 		const config = await Config.findOne({}, { _id: 0, __v: 0 });
// 		usePerspectiveAPI = config.usePerspectiveAPI;
// 	} catch (error) {
// 		usePerspectiveAPI = false;
// 	}

// 	if (!usePerspectiveAPI || !API_KEY || !DISCOVERY_URL) {
// 		return next();
// 	}

// 	try {
// 		const { content } = req.body;
// 		const summaryScores = await analyzeTextWithPerspectiveAPI(
// 			content,
// 			API_KEY,
// 			DISCOVERY_URL,
// 			timeout,
// 		);

// 		if (Object.keys(summaryScores).length > 0) {
// 			const type = 'inappropriateContent';
// 			return res.status(403).json({ type });
// 		} else {
// 			next();
// 		}
// 	} catch (error) {
// 		const errorMessage = `Error processing Perspective API response: ${error.message}`;
// 		await saveLogInfo(null, errorMessage, 'Perspective API', 'error');
// 		next();
// 	}
// };

// module.exports = analyzeContent;

const request = require('request');
const { saveLogInfo } = require('../middlewares/logger/logInfo');
const Config = require('../models/config.model');

const analyzeTextWithTheHiveAPI = async (content, API_KEY, timeout) => {
	const SCORE_THRESHOLD = 0.5;
	const apiUrl = 'https://api.thehive.ai/api/v2/task/sync';

	if (!API_KEY) {
		throw new Error('TheHive API Key not set');
	}

	try {
		const options = {
			method: 'POST',
			url: apiUrl,
			headers: {
				accept: 'application/json',
				authorization: `token ${API_KEY}`,
			},
			form: { content },
		};

		const responsePromise = new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) return reject(new Error(error));
				// console.log(JSON.parse(body));
				resolve(JSON.parse(body));
			});
		});

		const timeoutPromise = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Request timed out'));
			}, timeout);
		});

		const response = await Promise.race([responsePromise, timeoutPromise]);

		const summaryScores = {};
		for (const attribute in response.attributeScores) {
			const summaryScore =
				response.attributeScores[attribute].summaryScore.value;
			if (summaryScore >= SCORE_THRESHOLD) {
				summaryScores[attribute] = summaryScore;
			}
		}

		return summaryScores;
	} catch (error) {
		throw new Error(`Error analyzing text: ${error.message}`);
	}
};

const analyzeContent = async (req, res, next) => {
	const timeout = 5000; // 5 seconds
	const API_KEY = 'JuArNg2scCX9NZKecH6VAIzNdk9wCcCH'; // TheHive API Key

	let useTheHiveAPI;
	try {
		const config = await Config.findOne({}, { _id: 0, __v: 0 });
		useTheHiveAPI = config.usePerspectiveAPI;
	} catch (error) {
		useTheHiveAPI = false;
	}

	if (!useTheHiveAPI || !API_KEY) {
		return next();
	}

	try {
		const { content } = req.body;
		console.log(content);
		const summaryScores = await analyzeTextWithTheHiveAPI(
			content,
			API_KEY,
			timeout,
		);
		console.log(summaryScores);
		if (Object.keys(summaryScores).length > 0) {
			const type = 'inappropriateContent';
			return res.status(403).json({ type });
		} else {
			next();
		}
	} catch (error) {
		const errorMessage = `Error processing TheHive API response: ${error.message}`;
		await saveLogInfo(null, errorMessage, 'TheHive API', 'error');
		next();
	}
};

module.exports = analyzeContent;
