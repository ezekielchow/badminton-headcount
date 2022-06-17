
exports.getDashboard = (req, res, next) => {
    console.log(req.user);
    res.render('dashboard')
}