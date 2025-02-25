const mongoose = require ('mongoose');

const schema = new mongoose.Schema({
    name : {
        type : String,
        default : null
    },
    email : {
        type : String,
        default : null
    },
    password : {
        type : String,
        default : null
    },
    otp : {
        type : String,
        default : null
    }
},
{  
    timestamps: {
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
}
);
const users = new mongoose.model('Users', schema);

module.exports = users





