module.exports.fileUploader = (req, res, next) => {

}
const jwt = require('jsonwebtoken');
// const TOKEN_SECRET = asjfhauhrfkdnjafd;
function auth (req, res, next){
    const token = req.body('auth-token');
    if(!token) return res.status(401).json({
        message: "Access Denied"
    });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({
            message: "Invalid Token"
        })
    }
}