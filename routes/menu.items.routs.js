const express = require('express');

const {body} = require("express-validator");

const router = express.Router();

const itemsControllers = require('../controllers/menuItemControllers.js');
// const {validationResultSchema} = require('../middlewares/validationSchema.js');
const  verifyToken = require('../middlewares/verifyToken.js');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowTo.js');
//app.route ()--> you can composed more methods one routes 

router.route("/")
            .get(verifyToken,itemsControllers.getAllItems)
            .post(verifyToken,allowedTo(userRoles.ADMIN),itemsControllers.AddItem); 

router.route("/:id")
           .get(verifyToken,itemsControllers.getAnItem)
           .patch(verifyToken,allowedTo(userRoles.ADMIN),itemsControllers.updateItem)
           .delete(verifyToken,allowedTo(userRoles.ADMIN),itemsControllers.deleteItem);

module.exports = router;   

