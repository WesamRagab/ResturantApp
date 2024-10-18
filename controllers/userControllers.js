const asyncWrapper = require('../middlewares/asyncWrapper')
const User = require('../models/userModel');
const httpStatusText = require('../utils/httpStatusText'); //-->
const errorHandler = require('../utils/errorHandler'); //-->
const generateJWT = require('../utils/generateJWT'); //-->
const bcrypt = require('bcryptjs');



const getAllUsers =  asyncWrapper (async(req, res) => {
    
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({},{"__v" : false , password: false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS , data : {users}});
  });


  const getAUser = asyncWrapper(
    async(req, res ,next) => {
       const user = await User.findById(req.params.id);
     if (!user) {

       const error = errorHandler.create('course not found',404,httpStatusText.FAIL);
       return next(error);
     }
     return res.json({status : httpStatusText.SUCCESS, data: {user}});
    
   }

 );


const register = asyncWrapper (
    async (req , res , next)=>{
        console.log(req.body);
        const {firstName ,lastName ,email ,password , role} = req.body;


        const oldUser = await User.findOne({email: email});

        if (oldUser)
            {
                const error = errorHandler.create('This User Already exists',400,httpStatusText.FAIL);
                return next(error);
            }

        //   password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
           password :hashedPassword,
           role,
           avatar: req.file.filename
            
        });

       //generate jwt token
       const token = await generateJWT({email: newUser.email ,id: newUser._id ,role: newUser.role },process.env.JWT_SECRET_KEY , {expireIn :'1d'});
       newUser.token = token;
       await newUser.save();

       res.status(201).json({status : httpStatusText.SUCCESS, data: {user : newUser}});

    }
);


const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = errorHandler.create('Email and Password are Required', 400, httpStatusText.FAIL);
            return next(error);
        }

        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                const error = errorHandler.create('User not found', 400, httpStatusText.FAIL);
                return next(error);
            }

            // Await the bcrypt.compare result
            const matchedPassword = await bcrypt.compare(password, user.password);

            if (matchedPassword) {
                // Logged in Successfully
                const token = await generateJWT({ email: user.email, id: user._id, role: user.role });

                console.log({ data: { token } });
                res.json({ status: httpStatusText.SUCCESS, data: { token } });
            } else {
                const error = errorHandler.create('Invalid credentials', 401, httpStatusText.FAIL);
                return next(error);
            }
        } catch (err) {
            // Handle unexpected errors
            const error = errorHandler.create('Something went wrong', 500, httpStatusText.ERROR);
            return next(error);
        }
    }
);

const updateUser = asyncWrapper(
    async (req, res) => {
      const { id } = req.params;
      try {
        // Find the user by ID and update with the request body
        const user = await User.findByIdAndUpdate(id, { $set: { ...req.body } }, { new: true, runValidators: true });
  
        // If user not found
        if (!user) {
          return res.status(404).json({ status: httpStatusText.NOT_FOUND, message: "User not found" });
        }
  
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { user } });
      } catch (error) {
        // Handle potential errors (e.g., validation errors, invalid ID format)
        return res.status(400).json({ status: httpStatusText.ERROR, message: error.message });
      }
    }
  );
  
module.exports = {
    getAllUsers,
    getAUser,
    updateUser,
    register,
    login
}
