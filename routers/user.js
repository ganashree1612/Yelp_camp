const express = require("express")
const router = express.Router()
const catchAsync=require('../utils/catchAsync')
const User = require('../models/user')
const Users=require('../controllers/user')
const passport = require("passport")
const { storeReturnTo } = require("../middleware");
router.get('/register', Users.userRegister)

router.post('/register', catchAsync(Users.userRegisterlogic))

router.get('/login', Users.loginpage)

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), Users.loginlogic)

router.get("/logout", Users.userLogout); 
module.exports = router;