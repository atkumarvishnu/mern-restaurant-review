import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config()      //this configures next, so that we can hide our env variables in the .env file 

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true
    })
    .catch(err => {
        console.log(err.stack)
        process.exit(1)
    })
    .then(async client => {             
        await RestaurantsDAO.injectDB(client)                  //right before we start out server we are going to enject db, this is how we get a reference to the restaurants collections in the database
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })