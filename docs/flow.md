// Register — POST /api/v1/users/register :-

// 1. Client sends fullName, email, username, password, avatar, coverImage
// 2. src/index.js starts the server after connecting to MongoDB
// 3. src/app.js receives the request and mounts /api/v1/users
// 4. src/routes/user.routes.js matches POST /register
// 5. upload.fields() in multer.middleware.js handles avatar + coverImage files
// 6. registerUser() in user.controller.js executes
// 7. Controller validates required fields and checks duplicate user
// 8. Avatar/cover images are uploaded to Cloudinary (if supplied)
// 9. User.create({...}) creates and saves the user document
// 10. user.model.js pre-save hook runs before saving
// 11. bcrypt.hash(password, 10) hashes the password
// 12. MongoDB stores the user with the hashed password
// 13. Controller sends the success response to the client


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// Login — POST /api/v1/users/login

// 1. Client sends email/username + password in req.body
// 2. app.js parses JSON using express.json()
// 3. user.routes.js matches POST /login
// 4. loginUser() in user.controller.js executes
// 5. Controller checks whether email/username and password were provided
// 6. User.findOne() searches MongoDB for the user
// 7. If user doesn't exist, login fails
// 8. user.isPasswordCorrect(password) calls the model method
// 9. bcrypt.compare() compares entered password with stored hash
// 10. If password is wrong, login fails
// 11. generateAccessAndRefereshTokens(user._id) executes
// 12. Helper fetches user using User.findById()
// 13. user.generateAccessToken() creates the access JWT
// 14. user.generateRefreshToken() creates the refresh JWT
// 15. Helper stores refreshToken in MongoDB and saves the user
// 16. Controller fetches user data without password/refreshToken
// 17. Controller sets accessToken and refreshToken cookies
// 18. Controller sends success response with user and tokens


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Get current user — GET /api/v1/users/current-user

// 1. Client sends request with accessToken cookie
//    OR Authorization: Bearer <accessToken> header
// 2. app.js routes request to userRouter
// 3. user.routes.js matches GET /current-user
// 4. verifyJWT middleware executes BEFORE getCurrentUser
// 5. auth.middleware.js extracts token from cookie/header
// 6. If token is missing, middleware rejects the request
// 7. jwt.verify(token, ACCESS_TOKEN_SECRET) validates token
// 8. decodedToken._id provides the user's ID
// 9. User.findById(decodedToken._id) fetches the user
// 10. .select("-password -refreshToken") excludes sensitive fields
// 11. req.user = user attaches the user to the request
// 12. next() passes control to getCurrentUser()
// 13. getCurrentUser() reads req.user
// 14. Controller sends user details in the response


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Refresh access token — POST /api/v1/users/refresh-token

// 1. Client sends refreshToken cookie or refreshToken in req.body
// 2. user.routes.js matches POST /refresh-token
// 3. refreshAccessToken() executes
// 4. Controller extracts the incoming refresh token
// 5. If no token exists, request is rejected
// 6. jwt.verify() checks token using REFRESH_TOKEN_SECRET
// 7. decodedToken._id identifies the user
// 8. User.findById() fetches the user from MongoDB
// 9. Incoming token is compared with user.refreshToken in DB
// 10. If token doesn't match, request is rejected
// 11. generateAccessAndRefereshTokens(user._id) creates new tokens
// 12. Helper stores the new refresh token in MongoDB
// 13. Controller sets replacement cookies
// 14. Controller sends the new tokens in the response


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Logout — POST /api/v1/users/logout

// 1. Client sends logout request with access token
// 2. user.routes.js matches POST /logout
// 3. verifyJWT executes first
// 4. Middleware verifies access token and identifies the user
// 5. req.user is populated
// 6. next() calls logoutUser()
// 7. logoutUser() removes refreshToken from MongoDB using $unset
// 8. Controller clears the accessToken cookie
// 9. Controller clears the refreshToken cookie
// 10. Controller sends logout success response


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Change password — POST /api/v1/users/change-password

// 1. Client sends oldPassword + newPassword
// 2. user.routes.js matches POST /change-password
// 3. verifyJWT authenticates the user
// 4. next() calls changeCurrentPassword()
// 5. Controller reads req.user._id
// 6. User.findById() fetches the current user
// 7. user.isPasswordCorrect(oldPassword) checks the old password
// 8. If incorrect, controller rejects the request
// 9. If correct, user.password = newPassword
// 10. user.save({ validateBeforeSave: false }) saves the change
// 11. Mongoose pre-save hook detects modified password
// 12. bcrypt.hash() hashes the new password
// 13. MongoDB stores the updated password hash
// 14. Controller sends success response


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Update account details — PATCH /api/v1/users/update-account

// 1. Client sends updated account details
// 2. user.routes.js matches PATCH /update-account
// 3. verifyJWT authenticates the request
// 4. next() calls updateAccountDetails()
// 5. Controller reads req.user._id
// 6. Controller validates the fields being updated
// 7. User.findByIdAndUpdate() updates the user's document
// 8. Updated user data is returned (excluding sensitive fields)
// 9. Controller sends the response


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


Update avatar or cover image

// AVATAR: PATCH /api/v1/users/avatar

// 1. Request enters app.js
// 2. user.routes.js matches /avatar
// 3. verifyJWT authenticates the user
// 4. upload.single("avatar") processes the uploaded file
// 5. updateUserAvatar() executes
// 6. Controller uploads the file to Cloudinary
// 7. Controller updates the user's avatar URL in MongoDB
// 8. Controller sends success response

// COVER IMAGE: PATCH /api/v1/users/cover-image

// Same flow, but upload.single("coverImage") processes the file
// and updateUserCoverImage() updates the cover image URL.

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

