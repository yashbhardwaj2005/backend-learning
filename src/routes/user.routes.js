import { Router } from "express";
import { 
      loginUser,
      logoutUser,
      registerUser, 
      refreshAccessToken, 
      changeCurrentPassword, 
      getCurrentUser, 
      updateAccountDetails, 
      updateUserAvatar, 
      updateUserCoverImage, 
      getUserChannelProfile, 
      getWatchHistory 
    } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router()

router.route("/register").post(
    upload.fields([               // here upload is the multer middleware name
                                  // upload.fields() tells Multer which file fields to accept.
        {
            name: "avatar",
            maxCount: 1           // maxCount: 1 means a maximum of one file is allowed for each field.
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes  :-
router.route("/logout").post(verifyJWT, logoutUser)  //verifyJWT is a auth middleware injected just before logoutUser which is a controller
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)



export default router