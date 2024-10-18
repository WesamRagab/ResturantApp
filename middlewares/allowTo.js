const errorHandler = require('../utils/errorHandler');

module.exports = (...roles)=>{
     //   (...roles) return array of results ---> ['AdMIN', 'MANAGER']
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(errorHandler.create('This role is not authorized',401));
        }
        next();
    }
}