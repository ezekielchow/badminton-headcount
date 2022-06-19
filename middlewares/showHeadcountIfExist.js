const User = require('../models/user')

const showHeadcountIfExist = async (req, res, next) => {

    try {

        const path = req.path.slice(1)
        const user = await User.findOne({ uniqueUrl: path }).exec()

        if (user) {
            // Todo: get sessions etc from user
            console.log(user, 'asd');
        }

        next();
    } catch (err) {
        next();
    }
};

module.exports = showHeadcountIfExist;
