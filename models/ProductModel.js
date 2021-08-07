const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        brand:{
            type: String
        },
        model: {
            type: String
        },
        description:{
            type: String,            
        },
        color:{
            type:String
        },
        origin:{
            type:String
        },
        price:{
            type:Number
        }
    }
);

const ProductModel = mongoose.model('product',ProductSchema);
module.exports = ProductModel;




