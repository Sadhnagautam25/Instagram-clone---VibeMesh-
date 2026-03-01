const express = require("express");

const followRouter = express.Router();
const IdentifyUser = require("../middlewares/user.middleware");
const userController = require("../controllers/follow.controller");

// followRouter prifx => /api/users/

// create user follow request 🔟
// api name => /api/users/follow/:username
// api method => post
// status => 201

followRouter.post(
  "/follow/:reqId",
  IdentifyUser,
  userController.userFollowController,
);

// craete user unfollow request 1️⃣1️⃣
// api name => /api/users/unfollow/:username
// api method => delete
// status => 200

followRouter.delete(
  "/unfollow/:reqId",
  IdentifyUser,
  userController.userUnfollowController,
);

// ab user apni pending friend request fatch krega [followee] 1️⃣2️⃣
// api name => /api/users/friend/request
// api method => GET
// status => 200

followRouter.get(
  "/pending/request",
  IdentifyUser,
  userController.friendRequestController,
);


// ab user followee friend request accept krega 1️⃣2️⃣
// api name => /api/users/accept/reqId
// api method => PUT 
// status => 201

followRouter.put('/accept/:reqId', IdentifyUser, userController.acceptFrndRequestController)


// ab user followee friend request reject krega 1️⃣3️⃣
// api name => /api/users/reject/reqId
// api method => PUT 
// status => 201

followRouter.put('/reject/:reqId', IdentifyUser, userController.rejectFrndRequestController)


// ab user followee apni follower list fatch krega 1️⃣4️⃣
// api name => /api/users/accepted/requests/
// api Method => GET
// status => 200

followRouter.get('/follower', IdentifyUser, userController.fatchFrndListController)


// ab user maine kis ko follow kia h => following un users ko fatched krungi 
// api name => /api/users/following
// api Method => GET
// status => 200

followRouter.get('/following', IdentifyUser, userController.fatchFollowingListController)

// ab user apni request ka ststus check krega ki jisko usne[follower] => or status accept h vo data or agr status reject h toh vo data 

followRouter.get('/statusReq', IdentifyUser, userController.fatchStatusReqController)

module.exports = followRouter;
