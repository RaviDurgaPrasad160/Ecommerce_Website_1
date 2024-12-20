const exp = require('express')
const userApp = exp.Router()
require('dotenv').config()
const bcryptjs = require('bcryptjs')
let jwt = require('jsonwebtoken')
const expressAsyncHandler = require('express-async-handler')

// to extract body of request
userApp.use(exp.json())

// route to handle user login
userApp.post('/loginuser', expressAsyncHandler(async(req,res)=>{
    const userCollectionObj = req.app.get('userCollectionObj')
    const loginCredentials = req.body

    const userofDB = await userCollectionObj.findOne({email:loginCredentials.email})
    if(!userofDB){
        res.send({message:"Invalid email or password"})
    }
    // if username match
    else {
        // to compare passwords
        let isPasswordValid = await bcryptjs.compare(loginCredentials.password, userofDB.password)
        // if password does not match
        if(!isPasswordValid){
            res.send({message:"Invalid username or password"})
        }
        // if psssword match
        else {
            // create token
            const token = jwt.sign({message:userofDB.email}, process.env.SECRET_KEY, {expiresIn: '7d'})
            res.send({message:"success", payload:token, userObj:userofDB})
        }
    }
    
}))

// route to handle user creation
userApp.post('/create-user', expressAsyncHandler(async(req,res)=>{
    const userCollectionObj = req.app.get('userCollectionObj')
    const newUserObj = req.body

    // to check whether new user exist or not
    const userofDB = await userCollectionObj.findOne({email:newUserObj.email})
    // if username  exist
    if(userofDB){
       res.send({message:"user already exist"})
    }
    // if username does not existed
    else{
         // password hashing
         let hashedPassword = await bcryptjs.hash(newUserObj.password,6)
         
        //  assign hashed password
        newUserObj.password = hashedPassword;
        // insert newUser
        delete newUserObj.conformpassword
        await userCollectionObj.insertOne(newUserObj)

        res.send({message:"new user created"})
    }

}))

// route to handle update-user 
userApp.use('/update-user', expressAsyncHandler(async(req,res)=>{

}))

// route to handle delete route
userApp.use('remove-user', expressAsyncHandler(async(req,res)=>{

}))

module.exports = userApp

