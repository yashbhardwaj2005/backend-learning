import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// CORS(Cross-Origin Resource Sharing) :- Backend ko permission deta hai ki kaunse frontend/domain se API request accept karni hai.

app.use(cors({ 
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
 
// some configurations needed :-

app.use(express.json({limit: "16kb"})) // json data lene k liye
app.use(express.urlencoded({extended: true,limit:"16kb"})) //url se data lene k liye
app.use(express.static("public")) // images wagera public me rakne k liye 
app.use(cookieParser())

// routes import 
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter)  // ==> http://localhost:8000/api/v1/users/register


export {app}