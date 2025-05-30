const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    // Get the token from the header
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Access Denied: No token found" });
    }

    try {
        // Verify the token
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Access Denied: Invalid token" });
    }
}

module.exports = fetchUser;
