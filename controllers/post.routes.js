const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PostModel } = require("../model/post.model");
const { authMiddleware } = require("../middlewares/auth.middleware");
require("dotenv").config();

// Post : NEW
postRouter.post("/add", authMiddleware, async (req, res) => {
  try {
    const newPost = await new PostModel(req.body);
    await newPost.save();
    res.status(200).json({ msg: "New Post created", post: req.body });
  } catch (err) {
    res.status(200).json({ err: err.message });
  }
});
// postRouter.get("/", async (req, res) => {
//   try {
//     const { userID } = req.body;
//     const { device = ["Laptop", "Tablet", "Mobile"] } = req.query;

//     const posts = await PostModel.find({
//       $and: [{ userID }, { device: { $in: device } }],
//     });
//     res.json({ posts, msg: "Post are visible" });
//   } catch (error) {
//     res.status(200).json({ err: err.message });
//   }
// });

postRouter.get("/", async (req, res) => {
  const { userID } = req.body;
  const {
    device = ["Laptop", "Tablet", "Mobile"],
    // no_of_comments,
    maxComment,
    minComment,
    page,
    limit,
  } = req.query;
  try {
    const query = {};
    // let filter = { userID };

    if (device) {
      query.device = device;
    }

    if (minComment && maxComment) {
      query.no_of_comments = {
        $gte: Number(minComment),
        $lte: Number(maxComment),
      };
    }

    // pagination : 3 pages
    let ourPage = 1;
    let postPage = 3;
    if (page) {
      ourPage = page;
    }
    if (limit) {
      postPage = limit;
    }
    const skip = (ourPage - 1) * postPage;

    const posts = await PostModel.find(query).skip(skip).limit(postPage);
    const count = await PostModel.countDocuments(userID);
    const totalPages = Math.ceil(count / postPage);
    res.json({ posts, page, totalPages });
  } catch (err) {
    res.status(200).json({ err: err.message });
  }
});

postRouter.get("/top", async (req, res) => {
  try {
    const { userID } = req.body;
    const { page, limit } = req.query;

    let ourPage = 1;
    let postPage = 3;
    if (page) {
      ourPage = page;
    }
    if (limit) {
      postPage = limit;
    }
    const skip = (ourPage - 1) * postPage;
    const count = await PostModel.countDocuments(userID);

    const posts = await PostModel.find(userID)
      .sort({ no_of_comments: -1 })
      .skip(skip)
      .limit(postPage);
    res.json({ posts });
  } catch (err) {
    res.status(200).json({ err: err.message });
  }
});

// PATCH

postRouter.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await PostModel.findByIdAndUpdate(id, req.body);
    res.status(200).json({ msg: "successfully updated", updatedPost: updated });
  } catch (error) {
    res.status(200).json({ err: err.message });
  }
});

// DELETE

postRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PostModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "successfully deleted", deletedPost: deleted });
  } catch (error) {
    res.status(200).json({ err: err.message });
  }
});

module.exports = { postRouter };
