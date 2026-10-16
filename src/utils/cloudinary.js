 // cloudinary uploads the file on its server and gives your backend a URL. That URL is kept in your mongoDB
 
 import {v2 as cloudinary} from "cloudinary" 
 import fs from "fs"

 cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
 });

 const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload file on cloudinary syntax :-
        const response = await cloudinary.uploader.upload(localFilePath,{   // await means the function waits for the upload to finish before moving to the next line.
            resource_type: "auto"   // resource_type: "auto" lets Cloudinary detect the type of resource being uploaded.
        })
        return response;
    } catch (error) {
         console.error("Cloudinary error:", error);
        return null;
    } finally {
        // Multer's temporary file is no longer needed after success or failure.
        if (localFilePath) await fs.promises.unlink(localFilePath).catch(() => {});
    }
 }


 export {uploadOnCloudinary}
