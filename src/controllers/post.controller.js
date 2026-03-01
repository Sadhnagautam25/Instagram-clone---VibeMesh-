const postModel = require("../models/post.model");
const postLikeModel = require("../models/postLike.model");
const followModel = require("../models/follow.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// create post controller ✅

async function createPostController(req, res) {
  try {
    const userId = req.user.id;
    const username = req.user.username;
    const { caption } = req.body;

    let postImgUrl;

    if (req.file) {
      const uploadImg = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "postImg",
        folder: "InstaRevision/UserPosts",
      });

      postImgUrl = uploadImg.url;
    }

    const post = await postModel.create({
      caption,
      postImg: postImgUrl,
      user: userId,
    });

    res.status(201).json({
      message: `Hye 🙋‍♀️ ${username} Your Post created successfully. 🎉`,
      post,
    });
  } catch (error) {
    console.error("Post created error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// fatch all posts controller

async function fatchAllPostsController(req, res) {
  const username = req.user.username;

  const feedPosts = await Promise.all(
    (await postModel.find().populate("user").lean()).map(async (post) => {
      const isLiked = await postLikeModel.findOne({
        post: post._id,
        user: username,
      });

      // ek post pr kitne users ne like kia h [how many posts liked => postId kitni h same check and count]
      const userPostLiked = await postLikeModel.countDocuments({
        post: post._id,
      });

      post.userPostLiked = userPostLiked;
      post.isLiked = !!isLiked;

      return post;
    }),
  );

  res.status(200).json({
    message: "fatch all posts successfully. ✅",
    posts: feedPosts,
  });
}

// fatch specific user posts controller ✅

async function fatchUserPostsController(req, res) {
  try {
    const userId = req.user.id;
    const username = req.user.username;

    const posts = await Promise.all(
      (
        await postModel
          .find({
            user: userId,
          })
          .populate("user")
          .lean()
      ).map(async (post) => {
        const isLiked = await postLikeModel.findOne({
          post: post._id,
          user: username,
        });

        const userPostLiked = await postLikeModel.countDocuments({
          post: post._id,
        });

        post.isLiked = !!isLiked;
        post.userPostLiked = userPostLiked;
        return post;
      }),
    );

    if (!posts || posts.length === 0) {
      return res.status(200).json({
        message: "You don't have any posts.",
        posts: [],
      });
    }

    return res.status(200).json({
      message: `Hi 🙋‍♀️ ${username}, your posts fetched successfully.`,
      posts,
    });
  } catch (error) {
    console.error("User Posts Fatch error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// fatch user post detail controller ✅

async function userPostDetailController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const username = req.user.username;

    const post = await postModel
      .findOne({
        _id: postId,
      })
      .populate("user");

    if (!post) {
      return res.status(401).json({
        message: "Post not found ⚠️",
      });
    }

    const isValidUser = post.user._id.toString() === userId;

    if (!isValidUser) {
      return res.status(403).json({
        message: "Forbidden access ⚠️",
      });
    }

    res.status(200).json({
      message: `hye 🙋‍♀️ ${username} your post fatched sucessfully. 🎉`,
      post,
    });
  } catch (error) {
    console.error("Post detail fatch  error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// post delete controller ✅

async function postDeleteController(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findOne({
      _id: postId,
    });

    if (!post) {
      return res.status(401).json({
        message: "Post not found ⚠️",
      });
    }

    const isVaildUser = post.user.toString() === userId;

    if (!isVaildUser) {
      return res.status(403).json({
        message: "Forbidden access ⚠️",
      });
    }

    await postModel.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Your post deleted sucessfully.✅",
    });
  } catch (error) {
    console.error("User Post delete error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// post like controller ✅

async function postLikeController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(401).json({
        message: "Post not found ⚠️",
      });
    }

    // user ne phele se toh post like ni ki

    const alreadyLike = await postLikeModel.findOne({
      post: postId,
      user: username,
    });

    if (alreadyLike) {
      return res.status(200).json({
        message: "You already Like this post ✅",
      });
    }

    const postRecord = await postLikeModel.create({
      post: postId,
      user: username,
    });

    res.status(200).json({
      message: `hye 🙋‍♀️ ${username} You this post successfully. 🎉`,
    });
  } catch (error) {
    console.error("User Post like error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// post dislike controller ✅

async function postDislikeController(req, res) {
  try {
    const username = req.user.username;
    const postId = req.params.postId;

    // 1. kya ye post exists krti bhi h ??

    const isExistsPost = await postModel.findById(postId);

    if (!isExistsPost) {
      return res.status(401).json({
        message: "post not found ⚠️",
      });
    }

    // 2. kya user ne us post ko like bhi kia h ??

    const isLiked = await postLikeModel.findOne({
      post: postId,
      user: username,
    });

    if (!isLiked) {
      return res.status(400).json({
        message: `You can not like this post that's way You can't disLike ⚠️`,
      });
    }

    await postLikeModel.findByIdAndDelete(isLiked._id);

    res.status(200).json({
      message: "Post dislike successfully. ✅",
    });
  } catch (error) {
    console.error("User Post dislike error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// followee user detail ✅

async function followeeUserDetailController(req, res) {
  const postId = req.params.postId;

  const post = await postModel
    .findOne({
      _id: postId,
    })
    .populate("user")
    .lean();

  if (!post) {
    return res.status(401).json({
      message: "Post not found ⚠️",
    });
  }

  const howManyUserFollower = await followModel.countDocuments({
    followee: post.user._id,
  });

  const howManyUserFollowing = await followModel.countDocuments({
    follower: post.user._id,
  });

  const howManyUserPosts = await postModel.countDocuments({
    user: post.user._id,
  });

  post.follower = howManyUserFollower;
  post.following = howManyUserFollowing;
  post.posts = howManyUserPosts;

  res.status(200).json({
    message: `followee user fatched successfully.✅`,
    post,
  });
}

module.exports = {
  createPostController,
  fatchUserPostsController,
  userPostDetailController,
  postDeleteController,
  postLikeController,
  fatchAllPostsController,
  postDislikeController,
  followeeUserDetailController,
};
