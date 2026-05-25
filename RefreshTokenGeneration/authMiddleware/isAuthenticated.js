const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
	try {
		let token = req.get("authorization");
		if (!token) {
			res.status(400).json({ msg: "token not found" });
		}
		token = token.split(" ")[1];
		const decode = jwt.verify(token, "accessSecret");
		req.email = decode.email;
		next();
	} catch (err) {
		return res.status(401).json({ msg: "error,not authenticate" });
		console.log(err);
	}
}

function verifyRefresh(email, token) {
	try {
		const decode = jwt.verify(token, "refreshSecret");
		return decode.email === email;
	} catch (err) {
		console.log(err);

		return  false;
	}
}

module.exports = { verifyRefresh, isAuthenticated };
