const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  city: String,
  is_Married: Boolean,
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };

/* name ==> String
email ==> String
gender ==> String
password ==> String
age ==> Number
city ==> String
is_married ==> boolean */
