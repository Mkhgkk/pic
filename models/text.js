const mongoose = require("mongoose");

const TextSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: true,
  },
});

const Text = mongoose.model("Text", TextSchema);

exports.Text = Text;
