const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    dishName: {
        type: String,
        required: true,
        
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
//    image: {
//      type: String,
//      default: ''
//    }
});
module.exports = mongoose.model('Item', menuItemSchema);