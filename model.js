const mongoose = require("mongoose");
const path = require("path");
// const bcrypt = require('bcrypt')
const saltRounds = 10;

// const bcrypt = require('bcryptjs')

const bcrypt = require("bcryptjs");

// 定义一个用户模型，username是唯一的索引，表示不能被重复
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: {
    type: String,
    set(val) {
      // var hash = bcrypt.hashSync(val, saltRounds)
      // return require('bcrypt').hashSync(val, 10)
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(val, salt);
      return hash;
    },
  },
});

// const TextSchema = new mongoose.Schema({
//   text: {
//     type: String,
//     unique: true,
//   },
// });
// create the model for users and expose it to our app
const User = mongoose.model("User", UserSchema);

// const Text = mongoose.model("Text", TextSchema);
// 删除用户集合
// User.db.dropCollection('users')

// module.exports = { Text };
module.exports = { User };
