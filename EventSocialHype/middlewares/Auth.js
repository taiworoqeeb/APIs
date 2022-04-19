const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('authorization');
    if(!token) {
        return res.status(401).send({
            success: false,
            message: "Access Denied"
        });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: "Token is not valid"
        });
    }
}