const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

// User follow controller

async function userFollowController(req, res) {
  try {
    const followerId = req.user.id;
    const followerName = req.user.username;
    const followeeId = req.params.reqId;

    // 1. check khi user apne aap ko toh follow nhi kr raha

    if (followerId === followeeId) {
      return res.status(400).json({
        message: `${followerName} You can't Follow YourSelf ⚠️`,
      });
    }

    // 2. followee name userModel m exists bhi krta h ya nhi ??

    const isFolloweeExists = await userModel.findOne({
      _id: followeeId,
    });

    if (!isFolloweeExists) {
      return res.status(401).json({
        message: `Sorry! ${followeeId} Id is not exists is our User database ⚠️`,
      });
    }

    // 3. khi user ne phele se toh follow nhi kia hua ??

    const follow = await followModel.findOne({
      follower: followerId,
      followee: followeeId,
    });

    if (follow) {
      return res.status(200).json({
        message: `${followerName} You already follow ${followeeId} ✅`,
      });
    }

    const followRecord = await followModel.create({
      follower: followerId,
      followee: followeeId,
    });

    res.status(201).json({
      message: `Follow successfully`,
      follow: followRecord,
    });
  } catch (error) {
    console.error("User Follow error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// User unfollow controller

async function userUnfollowController(req, res) {
  try {
    const followerId = req.user.id;
    const followerName = req.user.username;
    const followeeId = req.params.reqId;

    // 1. user apne app ko unfollow toh ni kr raha

    if (followerId === followeeId) {
      return res.status(400).json({
        message: `You Can't unfollow your self ⚠️`,
      });
    }

    // 2. followee exists krta bhi ya nhi ??

    const isExistsFollowee = await userModel.findOne({
      _id: followeeId,
    });

    if (!isExistsFollowee) {
      return res.status(401).json({
        message: `${followeeId} is not exists in our users profiledata`,
      });
    }

    // 3. kya user ne followee ko follow bhi kia h ??

    const isFollow = await followModel.findOne({
      follower: followerId,
      followee: followeeId,
    });

    if (!isFollow) {
      return res.status(401).json({
        message: `${followerName} You Can't unfollow ${followeeId} beacuse You can not follow ${followeeId} ⚠️`,
      });
    }

    await followModel.findByIdAndDelete(isFollow._id);

    res.status(200).json({
      message: `${followerName} Now you unFollow ${followeeId} ✅`,
    });
  } catch (error) {
    console.error("User unFollow error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// [followee] pending fatch frnd request controller

async function friendRequestController(req, res) {
  try {
    const followeeId = req.user.id;
    const followeeName = req.user.username;

    // 1. Fetching pending requests
    const frndRequests = await followModel
      .find({
        followee: followeeId,
        status: "pending",
      })
      .populate("follower", "username profileImg") // User details lane ke liye
      .lean();

    // 2. Count calculate karna
    const count = frndRequests.length;

    if (count === 0) {
      return res.status(200).json({
        message: "Now.. You don't have any friend request ✖️",
        count: 0,
      });
    }

    // 3. Response mein count bhejna
    res.status(200).json({
      message: `Hey 🙋‍♀️ ${followeeName}, you have ${count} pending friend request(s).`,
      count: count, // Yahan count add kar diya
      data: frndRequests,
    });
  } catch (error) {
    console.error("Fetch friend request error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// [followee] friend request accept controller

async function acceptFrndRequestController(req, res) {
  try {
    const followeeName = req.user.username;
    const followeeId = req.user.id;
    const reqId = req.params.reqId;

    // 1. jo request id aai h vo hmare followModel m exists bhi krti h

    const isReqIdExists = await followModel.findById(reqId);

    if (!isReqIdExists) {
      return res.status(401).json({
        message: "This Request Id is not exists in followModel collection ⚠️",
      });
    }

    // 2. already request accept toh ni h ??

    const isAlreadyAccept = await followModel.findOne({
      _id: reqId,
      followee: followeeId,
      status: "accepted",
    });

    if (isAlreadyAccept) {
      return res.status(200).json({
        message: "Already accpted request ✅",
      });
    }

    // pending request => accepted

    const acceptRecord = await followModel.findByIdAndUpdate(
      {
        _id: reqId,
        followee: followeeId,
        status: "pending",
      },
      { status: "accepted" },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "Accepted friend request ✅",
      data: acceptRecord,
    });
  } catch (error) {
    console.error(" friend request accept error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// [followee] friend request reject controller

async function rejectFrndRequestController(req, res) {
  try {
    const followeeName = req.user.username;
    const followeeId = req.user.id;
    const reqId = req.params.reqId;

    // 1. reqId exists krti h ya nhi

    const isReqExists = await followModel.findById(reqId);

    if (!isReqExists) {
      return res.status(401).json({
        message:
          "This request Id is not exists in our followModel collection ⚠️",
      });
    }

    // 2. phele se toh reject nhi h ??

    const isAlreadyReject = await followModel.findOne({
      _id: reqId,
      followee: followeeId,
      status: "rejected",
    });

    if (isAlreadyReject) {
      return res.status(200).json({
        message: "You are already reject request ✅",
      });
    }

    // 3. pending req => reject

    const rejectRecord = await followModel.findByIdAndUpdate(
      {
        _id: reqId,
        followee: followeeId,
        status: "pending",
      },
      { status: "rejected" },
      { returnDocument: "after" },
    );

    res.status(200).json({
      message: "You rejected this request succesfully. ✅",
      data: rejectRecord,
    });
  } catch (error) {
    console.error(" friend request reject error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// [followee] fatch friend list controller [meri id]

async function fatchFrndListController(req, res) {
  try {
    const followeeName = req.user.username;
    const followeeId = req.user.id;

    const frndList = await followModel
      .find({
        followee: followeeId,
      })
      .populate("follower");

    if (frndList.length === 0) {
      return res.status(401).json({
        message: "You have No friends Yet ☹️",
      });
    }
    res.status(200).json({
      message: `hye 🙋‍♀️ ${followeeName} Fatched successfully... your friend list ✅`,
      data: frndList,
    });
  } catch (error) {
    console.error(" fatch friend list error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// user fatch following people controller

async function fatchFollowingListController(req, res) {
  try {
    const followerName = req.user.username;
    const followerId = req.user.id;

    const frndList = await followModel
      .find({
        follower: followerId,
      })
      .populate("followee");

    if (frndList.length === 0) {
      return res.status(401).json({
        message: "You have No friends Yet ☹️",
      });
    }
    res.status(200).json({
      message: `hye 🙋‍♀️ ${followerName} Fatched successfully... your following friend list ✅`,
      data: frndList,
    });
  } catch (error) {
    console.error(" fatch following friend list error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// user ki req ka status kya h accept h ya reject h

async function fatchStatusReqController(req, res) {
  try {
    const followerId = req.user.id;

    // 1. Sirf 'accepted' ya 'rejected' status wali requests dhoondein
    const followRequests = await followModel
      .find({
        follower: followerId,
        status: { $in: ["accepted", "rejected"] },
      })
      .populate("followee", "username profileImg") // Sirf zaroori fields populate karein
      .lean();

    // 2. Check: Agar empty array hai
    if (!followRequests || followRequests.length === 0) {
      return res.status(200).json({
        message: "No accepted or rejected requests found.",
        data: [],
      });
    }

    // 3. Success Response
    res.status(200).json({
      success: true,
      count: followRequests.length,
      data: followRequests,
    });
  } catch (error) {
    console.error("Fetch Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  userFollowController,
  userUnfollowController,
  friendRequestController,
  acceptFrndRequestController,
  rejectFrndRequestController,
  fatchFrndListController,
  fatchFollowingListController,
  fatchStatusReqController,
};
