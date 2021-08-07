// Import mongoose
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true            
        },
        email: {
            type: String,
            required: true            
        },
        password:{
            type: String
        },
        phoneNumber:{
            type:String
        }
    }
);

const UserModel = mongoose.model('users', UsersSchema);
module.exports = UserModel;