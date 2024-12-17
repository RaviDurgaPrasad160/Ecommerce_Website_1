const exp = require('express')
const cors = require('cors')
// importing mongodb
let mclient = require('mongodb').MongoClient
require('dotenv').config()

const app = exp()

app.use(cors())

// DB connetion URL
let DBurl = process.env.MONGODB_URL

mclient.connect(DBurl)
.then((client)=>{
    // get database obj
    let dbobj = client.db('prasad2024')
    
    // creating userCollection obj
    let userCollectionObj = dbobj.collection('userCollection')

    // sharing userCollection obj to api
    app.set('userCollectionObj', userCollectionObj)
    
    console.log('DB connection is successfull') 
})
.catch(err=> console.log(`Error in DB ${err}`))

// import userApp
const userApp = require('./APIS/userApi')

// excute spacific middileware based on path
app.use("/user-api", userApp)


// Invalid path middleware
app.use((req,res,next)=>{
    res.send({message:`Invalid path ${req.url}`})
})

// error handle middleware
app.use((err,req,res,next)=>{
    res.send({message:`${err}`})
})

let port = 8000 || process.env.PORT

app.listen(port,()=>{
    console.log(`server listing on port ${port}`)
})

