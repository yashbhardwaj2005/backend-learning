// Multer is middleware used in Express to handle uploaded files.
// It saves the file temporarily on your server.

import multer from "multer";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({          // This tells Multer to save uploaded files on your computer/server with two setting 1) Destination 2) File Name
    destination: function (req, file, cb) {  // cb => callback
      cb(null, "./public/temp")             // You can think of cb(null, value) as saying, “There is no error; use this value.”
    },
    filename: function (req, file, cb) {
      
      cb(null, `${randomUUID()}${path.extname(file.originalname)}`)
    }
  })
  
export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (!file.mimetype.startsWith("image/")) return cb(new ApiError(400, "Please upload an image file"));
      cb(null, true);
    },
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Q) How does Multer know which file to receive?
// Ans) refer (src/routes/user.routes.js) in /register there is logic of what to upload 

// Q) How to access uploaded files ?
// Ans) req.files


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
FILE UPLOAD FLOW:

User uploads file
      ↓
Multer receives file
      ↓
File saved temporarily in public/temp
      ↓
Backend uploads file to Cloudinary
      ↓
Cloudinary returns file URL
      ↓
URL saved in MongoDB (through user.create in /register )
      ↓
Temporary local file deleted
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
