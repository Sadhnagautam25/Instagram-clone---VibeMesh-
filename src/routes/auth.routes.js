const express = require("express");
const authController = require("../controllers/auth.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const IdentifyUser = require("../middlewares/user.middleware");
const authRouter = express.Router();

// authRouter prifix is ==> /api/auth

// create register api 1️⃣✅
// api name => /api/auth/register
// api method => POST
// status => 200

authRouter.post(
  "/register",
  upload.single("profileImg"),
  authController.registercontroller,
);

// create login api 2️⃣✅
// api name => /api/auth/login
// api method => POST
// status => 200

authRouter.post("/login", authController.loginController);

// create Get-me api 3️⃣✅
// api name => /api/auth/get-me
// api method => GET
// status => 200

authRouter.get("/get-me", IdentifyUser, authController.getMeController);

// create User profile update api 4️⃣✅

// api name => /api/auth/update
// api method => PUT
// status => 200

authRouter.put(
  "/update",
  upload.single("profileImg"),
  IdentifyUser,
  authController.updateUserController,
);


// user logout api 

// api name => /api/auth/logut
// api method => GET
// status => 200

authRouter.get('/logout', authController.logoutController)

module.exports = authRouter;
