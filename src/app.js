import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/error.middleware.js"

const app = express()  // Create Express application

// CORS(Cross-Origin Resource Sharing) :- CORS ek security mechanism hai jo browser ko batata hai ki kaunse frontend origin ko backend ke response ko access karne ki permission hai.
app.use(cors({            
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
 
// some middleware configurations needed before routes :-

app.use(express.json({limit: "16kb"})) // json data parse krne k liye taki req.body data access kar paye  || limit:16kb limits the JSON request body to approximately 16 KB to avoid heavy file load
app.use(express.urlencoded({extended: true,limit:"16kb"})) //url se data lene k liye
app.use(express.static("public")) // ye public me rakhe files,images,logo etc ka browser ko direct access deta hai 
app.use(cookieParser()) // cookie-parser makes it easy for Express to access cookies (sent by browser) through req.cookies

// routes import 
import userRouter from './routes/user.routes.js'   // Bring me the user-related routes.

// routes declaration
app.use("/api/v1/users",userRouter)  // ==> http://localhost:8000/api/v1/users/register
app.use(errorHandler) // Error middleware goes after the routes.


export {app}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SUMMARY OF THIS FILE :-

// 1. Create Express app
//         ↓
// 2. Configure request-processing middleware
//         ↓
// 3. Import routers
//         ↓
// 4. Mount routers at URL prefixes
//         ↓
// 5. Export app


