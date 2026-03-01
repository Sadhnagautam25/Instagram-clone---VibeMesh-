const userModel = require("../models/user.model");
const followModel = require("../models/follow.model");
const postModel = require("../models/post.model");
const bcrypt = require("bcryptjs");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const genrateToken = require("../utils/genrateToken");
const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// register api controller ✅

async function registercontroller(req, res) {
  try {
    const { username, email, password, bio } = req.body;

    // validation

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "All fields are mandatory ⚠️",
      });
    }

    // check user already exists toh nhi h ??

    const isAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isAlreadyExists) {
      return res.status(409).json({
        message:
          isAlreadyExists.username === username
            ? `${username} is Alrady exists try another User name ⚠️`
            : `${email} is Already exists try another email ⚠️`,
      });
    }

    const hash = await bcrypt.hash(password, 10);

    let profileImgUrl;

    if (req.file) {
      const uploadProfile = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "profileImg",
        folder: "InstaRevision/userProfiles",
      });

      profileImgUrl = uploadProfile.url;
    }

    // create user in userModel

    const user = await userModel.create({
      username,
      email,
      password: hash,
      bio,
      profileImg: profileImgUrl || undefined,
    });

    // grnrate token and save user browser cookies

    const token = genrateToken(user);

    res.cookie("token", token);

    res.status(201).json({
      message: `Hye 🙋‍♀️ ${user.username} You are registered successfully. 🎉`,
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    console.error("Registered erroe:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// login api controller ✅

async function loginController(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username }, { email }],
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials ⚠️",
      });
    }

    const isVaildPassword = await bcrypt.compare(password, user.password);

    if (!isVaildPassword) {
      return res.status(401).json({
        message: "Invalid Password ⚠️",
      });
    }

    const token = genrateToken(user);
    res.cookie("token", token);

    res.status(200).json({
      message: `hye 🙋‍♀️ ${user.username} You are LoggedIn sucessfully.🎉`,
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    console.error("LoggedIn erroe:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// get-me api controller ✅

async function getMeController(req, res) {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId).lean();

    const howManyUserFollower = await followModel.countDocuments({
      followee: userId,
    });

    const howManyUserFollowing = await followModel.countDocuments({
      follower: userId,
    });

    const howManyUserPosts = await postModel.countDocuments({
      user: userId,
    });

    user.followers = howManyUserFollower;
    user.following = howManyUserFollowing;
    user.posts = howManyUserPosts;

    res.status(200).json({
      message: `hye 🙋‍♀️ ${user.username} fatched Your profile successfully.`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profileImg: user.profileImg,
        follower: user.followers,
        following: user.following,
        posts: user.posts,
      },
    });
  } catch (error) {
    console.error("Fatched profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// update profile api controller ✅

async function updateUserController(req, res) {
  try {
    const { username, email, password, bio } = req.body;

    const userId = req.user.id;

    // isme jo data aaega vo formdata jaisa bhejna hoga

    let profileImgUrl;

    if (req.file) {
      const uploadProfile = await client.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), "file"),
        fileName: "profileImg",
        folder: "InstaRevision/userProfiles",
      });

      profileImgUrl = uploadProfile.url;
    }

    const updateData = {
      username,
      email,
      bio,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (profileImgUrl) {
      updateData.profileImg = profileImgUrl;
    }

    const user = await userModel.findByIdAndUpdate(userId, updateData);

    res.status(200).json({
      message: `hye 🙋‍♀️ ${user.username} Your profile updated successfully 🎉`,
      user,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

// logout controller ✅

async function logoutController(req, res) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "token not found ⚠️",
    });
  }

  res.clearCookie("token");

  await blackListModel.create({
    token,
  });

  res.status(200).json({
    message: "You logged out successfully.✅",
  });
}

module.exports = {
  registercontroller,
  loginController,
  getMeController,
  updateUserController,
  logoutController,
};
