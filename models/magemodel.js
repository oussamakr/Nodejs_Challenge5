const mongoose = require("mongoose");

const imagemodel = mongoose.model("imagemodel", {
  name: {
    type: String,
  },
  discription: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = imagemodel;
