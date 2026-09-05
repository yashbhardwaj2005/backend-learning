import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// some configurations needed :-

app.use(express.json({limit: "16kb"})) // json data lene k liye
app.use(express.urlencoded({extended: true,limit:"16kb"})) //url se data lene k liye
app.use(express.static("public")) // images wagera public me rakne k liye 
app.use(cookieParser())



export {app}