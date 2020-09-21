const mongoose = require('mongoose')
const Product = require('./product')

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

userSchema.pre('remove', function(next) {
    Product.find({user: this.id }, (err, products) => {
        if(err){
            next(err)
        } else if (products.length > 0) {
            next(new Error('This user has products still'))
        } else {
            next()
        }
    })
})
module.exports = mongoose.model('User', userSchema)