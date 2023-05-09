module.exports = function() {
    return function(req, res, next) {
        req.siteUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}`;
        next();
    }
}