

exports.checkRole = roles => (req, res, next) => {
    if(!roles.includes(req.user.role)){ 
        return res.status(401).json({
            status: false,
            message: "Unauthorized"}) 
        }
       return next();
    };