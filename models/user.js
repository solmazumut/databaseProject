const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname:{
        type: String
    },
    email:{
        type: String
    },
    phoneNumber:{
        type: String
    }
})

module.exports = mongoose.model('User', userSchema)