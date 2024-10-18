const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers.js'); 
const verifyToken = require('../middlewares/verifyToken.js');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowTo.js');
const {validationResultSchema} = require('../middlewares/validationSchema');
const multer = require('multer');



const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('FILE',file);
        cb(null ,'uploads');
    },
    filename: function(req,file,cb) {   
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb )=>{
    const imageType = file.mimetype.split('/')[0];
    if(imageType ==='image'){
        return cb(null, true);
    }else {
        return cb(appError.create('File must be an image',400),false);
    }
}

const upload = multer({
    storage:diskStorage,
    fileFilter
});




router.route("/")
            .get(verifyToken,allowedTo(userRoles.ADMIN), userControllers.getAllUsers);

router.route("/:id")
            .get(allowedTo(userRoles.ADMIN,userRoles.USER), userControllers.getAUser)
            .patch(verifyToken,allowedTo(userRoles.ADMIN,userRoles.USER),userControllers.updateUser);


router.route('/register')
             .post(validationResultSchema(),upload.single('avatar'),userControllers.register);


router.route('/login')
             .post(userControllers.login);   

             
 module.exports = router;