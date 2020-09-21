const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    bartyValue:{
        type: Number
    },
    image: {
        type: Buffer
    },
    imageType:{
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

productSchema.virtual('imagePath').get(function(){
    if(this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Product', productSchema)
