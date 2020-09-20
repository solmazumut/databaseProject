const express = require('express')
const router = express.Router()
const User = require('../models/user')

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
        //res.redirect(`users/${newUser.id}`)
        res.redirect(`users`)
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

module.exports = router