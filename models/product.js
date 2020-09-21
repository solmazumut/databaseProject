const mongoose = require('mongoose')
const path = require('path')
const ImageBasePath = 'uploads/productImages'

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
    imageName: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

productSchema.virtual('imagePath').get(function(){
    if(this.imageName != null) {
        return path.join('/', ImageBasePath, this.imageName)
    }
})

module.exports = mongoose.model('Product', productSchema)
module.exports.ImageBasePath = ImageBasePath