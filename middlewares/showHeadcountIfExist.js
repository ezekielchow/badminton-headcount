const moment = require('moment')

const User = require('../models/user')

const showHeadcountIfExist = async (req, res, next) => {

    try {

        const path = req.path.slice(1)
        const user = await User.findOne({ uniqueUrl: path }).exec()

        if (user) {
            // Todo: get sessions etc from user
            const headcounts = await user.populate({ path: 'headcounts', match: { date: { $gte: moment(0, 'hh').format() } } })
            console.log(headcounts, 'asd');
        }

        next();
    } catch (err) {
        console.log(err)
        next();
    }
};

module.exports = showHeadcountIfExist;
