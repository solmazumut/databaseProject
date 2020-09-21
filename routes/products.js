const express = require('express')
const router = express.Router()

const Product = require('../models/product')
const User = require('../models/user')

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

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
router.post('/', async (req,res) => {
    const fileName = req.file != null ? req.file.filename : null
    const product = new Product({
        title: req.body.title,
        user: req.body.user,
        createdAt: new Date(req.body.createdAt),
        bartyValue: req.body.bartyValue,
        description: req.body.description
    })
    saveImage(product,req.body.Image)
    try{
    const newProduct = await product.save()
    //res.redirect(`products/${newProduct.id}`)
    res.redirect(`products`)
    } catch {
    renderNewPage(res, product, true)
    }
})

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

function saveImage(product, imageEncoded) {
    if(imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if(image != null && imageMimeTypes.includes(image.type)) {
        product.image = new Buffer.from(image.data, 'base64')
        product.imageType = image.type
    }
}

module.exports = router