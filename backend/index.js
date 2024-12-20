const exp = require('express')
const cors = require('cors')
// importing mongodb
let mclient = require('mongodb').MongoClient
require('dotenv').config()

const app = exp()

app.use(cors())

// DB connetion URL
let DBurl = process.env.MONGODB_URL

// Connect to MongoDB
mclient.connect(DBurl)
.then((client)=>{
  
    let dbobj = client.db('prasad2024')
    let userCollectionObj = dbobj.collection('userCollection')

    // sharing userCollection obj to api
    app.set('userCollectionObj', userCollectionObj)
    console.log('DB connection is successfull') 
})
.catch((err) => {
    console.error(`Error in DB connection: ${err}`);
    process.exit(1); // Exit process if DB connection fails
  });

// import userApp
const userApp = require('./APIS/userApi')

// excute spacific middileware based on path
app.use("/user-api", userApp)


// Invalid path middleware
app.use((req,res,next)=>{
    res.status(404).send({ message: `Invalid path: ${req.url}` });
})

// error handle middleware
app.use((err,req,res,next)=>{
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
})

let port = 8000 || process.env.PORT

app.listen(port,()=>{
    console.log(`server listing on port ${port}`)
})

