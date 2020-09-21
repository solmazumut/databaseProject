const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Product = require('../models/product')

//All Users Route
router.get('/', async (req,res)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const users = await User.find(searchOptions)
        res.render('users/index', {
            users: users, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }

})

//New User Route
router.get('/new',  (req,res)=>{
    res.render('users/new', {user: new User() })
})

// Create User Route
router.post('/', async (req,res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    })
    try {
        const newUser = await user.save()
        res.redirect(`users/${newUser.id}`)
    } catch {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
    // let locals = { errorMessage : `something went wrong` }
    // user.save((error, newUser) => {
    //     if(error) {
    //         res.render('users/new', locals)
    //     } else {
    //         //res.redirect(`users/${newUser.id}`)
    //         res.redirect(`users`)
    //     }
    // })
    // res.send(req.body.name)
})

router.get('/:id', async (req,res) => {
    try {
      const user = await User.findById(req.params.id)
      const products  = await Product.find({user: user.id}).limit(6).exec()
      res.render('users/show', {
         user: user,
         productsByUser: products 
      })
    } catch {
        res.redirect('/')
    }

})

router.get('/:id/edit', async (req,res) =>{
    try {
        const user = await User.findById(req.params.id)
        res.render('users/edit', {user: user })
    } catch {
        res.redirect('/users')
    }
})

router.put('/:id', async (req,res) =>{
    let user
    try {
        user = await User.findById(req.params.id)
        user.name = req.body.name
        user.surname = req.body.surname
        user.email = req.body.email
        user.phoneNumber = req.body.phoneNumber
        await user.save()
        res.redirect(`/users/${user.id}`)
    } catch {
        if(user == null) {
            res.redirect('/')
        } else {
            res.render('users/new', {
                user: user,
                errorMessage: 'Error updating User'
            })
        }
    }
})

router.delete('/:id', async (req,res) =>{
    let user
    try {
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect(`/users`)
    } catch {
        if(user == null) {
            res.redirect('/')
        } else {
            res.redirect(`/users/${user.id}`)
        }
    }
})

module.exports = router