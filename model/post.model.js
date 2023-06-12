const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: String,
  body: String,
  device: {
    type: String,
    required: true,
    enum: ["Laptop", "Tablet", "Mobile"],
  },
  no_of_comments: Number,
  userID: String,
});

const PostModel = mongoose.model("post", postSchema);

module.exports = { PostModel };

/* title ==> String
body ==> String
device ==> String
no_of_comments ==> Number */
