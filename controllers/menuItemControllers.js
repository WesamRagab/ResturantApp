    //  controllers that which putting the Route Handler on it

    const {validationResult} = require("express-validator");
    const Item= require('../models/menu.item.model');
    const httpStatusText = require('../utils/httpStatusText.js');
    const asyncWrapper = require ('../middlewares/asyncWrapper.js');
    const appError = require('../utils/errorHandler.js')
    
    const getAllItems = asyncWrapper (async(req, res) => {
      const query = req.query;
      const limit = query.limit || 10;
      const page = query.page || 1;
      const skip = (page - 1) * limit;
      console.log(req.user)
      const items = await Item.find({},{"__v" : false}).limit(limit).skip(skip);
      res.json({status: httpStatusText.SUCCESS , data : {items}});
    })

      const getAnItem = asyncWrapper(
         async(req, res ,next) => {
            const item = await Item.findById(req.params.id);
          if (!item) {
    
            const error = appError.create('this item not found',404,httpStatusText.FAIL);
            return next(error);
          }
          return res.json({status : httpStatusText.SUCCESS, data: {item}});

        }
    
      );

    
      const AddItem = asyncWrapper(
        async(req, res ,next) => {
          
          //i want to send data to the backend so i will use req.body to write data through it, and parsing the data from "String" to "json"
           const errors = validationResult(req);
          if (!errors.isEmpty()) {
            const error = appError.create(errors.array() ,400,httpStatusText.FAIL);
            return next(error);
          }
      
          const item = new Item (req.body);
      
          await item.save();
      
          res.status(201).json({status : httpStatusText.SUCCESS, data: {item : item}});
        }
      );

    
      const updateItem = asyncWrapper(
        async (req, res) => {

          const id = req.params.id;
          const item= await Item.findByIdAndUpdate(id ,{$set :{ ...req.body}},{new:true});
          return res.status(200).json({status : httpStatusText.SUCCESS, data: {item : item}});

        }
      );
    

      const deleteItem = asyncWrapper(
        async(req, res) => {

         await Item.deleteOne({_id : req.params.id});
        //or use splice function
        res.status(200).json({ status : httpStatusText.SUCCESS , data : null });
      }
    );
    
      module.exports = {
           getAllItems,
           getAnItem,
          AddItem,
         updateItem,
         deleteItem
      }
    
      