const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const errorHandler = require('../utils/errorHandler');



const verifyToken = (req , res ,next )=>{

    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!authHeader)
    {
        const error = errorHandler.create('token is required',401,httpStatusText.ERROR);
        return next(error);

    }

    const token = authHeader.split(' ')[1];
    
   try{
    const currentUser = jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.user = currentUser;    
    next();

   }catch(err){
    const error = errorHandler.create('invalid token',401,httpStatusText.ERROR);
    return next(error);
    // return res.status(401).json();

   }

}

module.exports = verifyToken ;