export const Logger = (logger) => {
	return (req, res, next) => {
		const startTime = process.hrtime();

		const originalEnd = res.end;

		res.end = function (...args) {
			const [seconds, nanoseconds] = process.hrtime(startTime);
			const duration = seconds * 1000 + nanoseconds / 1e6;

			const logData = {
				method: req.method,
				url: req.url,
				params: req.params,
				query: req.query,
				body: req.body,
				statusCode: res.statusCode,
				duration: `${duration.toFixed(2)}ms`,
				userAgent: req.get("user-agent"),
				ip: req.ip,
			};

			logger.api(`${req.method} ${req.url}`, logData);
			originalEnd.apply(res, args);
		};

		next();
	};
};
