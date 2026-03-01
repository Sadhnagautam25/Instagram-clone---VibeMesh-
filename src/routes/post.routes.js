const express = require("express");
const IdentifyUser = require("../middlewares/user.middleware");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// postRouter prifix => /api/posts

// create post api 5️⃣✅
// api name => /api/posts/
// api method => POST
// status => 201

postRouter.post(
  "/",
  upload.single("postImg"),
  IdentifyUser,
  postController.createPostController,
);

// fatch all posts to show in feed page 🔥✅
// api name => /api/posts/

postRouter.get('/',IdentifyUser , postController.fatchAllPostsController)

// create api => fatch all posts for specific user 6️⃣✅
// api name => /api/posts/
// api method => GET
// status => 200

postRouter.get("/userposts", IdentifyUser, postController.fatchUserPostsController);

// create api => fatch specific User post detail 7️⃣✅
// api name => /api/posts/detail/:postId
// api method => Get
// api status => 200

postRouter.get(
  "/detail/:postId",
  IdentifyUser,
  postController.userPostDetailController,
);

// create api => Specific post delete 8️⃣✅
// api name => /api/posts/delete/:postId
// api method => Get
// api status => 200

postRouter.delete(
  "/delete/:postId",
  IdentifyUser,
  postController.postDeleteController,
);

// create api => Specific User post like 9️⃣
// api name => /api/posts/likes/:postId
// api method => Get
// api status => 200

postRouter.post(
  "/likes/:postId",
  IdentifyUser,
  postController.postLikeController,
);

// create api => Specific User post dislike 9️⃣
// api name => /api/posts/dislike/:postId
// api method => delete
// api status => 200

postRouter.delete('/dislike/:postId', IdentifyUser, postController.postDislikeController)

// jisko follow krna h us user ka profile fatch kro ✅

postRouter.get('/user/:postId', postController.followeeUserDetailController)


module.exports = postRouter;
