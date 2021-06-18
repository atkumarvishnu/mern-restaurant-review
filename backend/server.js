import express from "express" //add express
import cors from "cors"   //add cors
import restaurants from "./api/restaurants.route.js"  //we will have routes in a seperate file


const app = express();  

//middlewares
app.use(cors());    //cors middleware  
app.use(express.json());    //JSON middleware - this allows us to parse JSON, because our server will be sending and recieving JSON

//routes
app.use("/api/v1/restaurants", restaurants)     // every route will start with this address
app.use("*", (req, res) => res.status(404).json({error: "not found"}))


export default app 