const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Product = require('../models/product')
const User = require('../models/user')
const { remove } = require('../models/product')
const uploadPath = path.join('public', Product.ImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//All Products Route
router.get('/', async (req,res)=>{
    let query = Product.find()
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('createdAt', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('createdAt', req.query.publishedAfter)
    }
    try{
        const products = await query.exec()
        res.render('products/index', {
            products: products,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }

})

//New Product Route
router.get('/new', async (req,res)=>{
    renderNewPage(res, new Product())
})

// Create Product Route
router.post('/', upload.single('Image'), async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    const product = new Product({
        title: req.body.title,
        user: req.body.user,
        createdAt: new Date(req.body.createdAt),
        bartyValue: req.body.bartyValue,
        imageName: fileName,
        description: req.body.description
    })
    try{
    const newProduct = await product.save()
    //res.redirect(`products/${newProduct.id}`)
    res.redirect(`products`)
    } catch {
    if(product.imageName != null) {
        removeImage(product.imageName)
    }  
    renderNewPage(res, product, true)
    }
})

function removeImage(filename){
    fs.unlink(path.join(uploadPath, filename), error => {
        if (error) console.error(error)
    })
}

async function renderNewPage(res, product, hasError = false) {
    try {
        const users = await User.find({})
        const params = {
            users: users,
            product: product
        }
        if(hasError) params.errorMessage = 'Error Creating Product'
        res.render('products/new', params)
    } catch {
        res.redirect('/products')
    }
}

module.exports = router