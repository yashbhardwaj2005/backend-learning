import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function () {    //  pre("save"): Run this function before saving a document.

    if (!this.isModified("password")) return; // Only hash a new or changed password.
    this.password = await bcrypt.hash(this.password, 10)  // bcrypt.hash(this.password, 10): Converts the password into a secure hash. || this.password = ...: Replaces the plaintext password with the hash.
    
    // next() told Mongoose to proceed to the next middleware. Now,because your function is async, Mongoose automatically waits for it to finish. So now we dont use next() in 2026 in mongoose 9 or above
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password) // bcrypt.compare() returns true if the supplied password matches the stored hash, otherwise false.
}

// Generate ACCESS TOKEN :-   USUALLY SHORT LIVED 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(    // jwt.sign consist of 3 parts : 1)PAYLOAD 2)SECRET 3)EXPIRY
        {
            _id: this._id,         //this._id means user id
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//GENERATE REFRESH TOKEN:-  USUALLY LONG LIVED 

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(       // jwt.sign in refresh token consists of same 3 parts but here payload has only user id
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
