const { default: mongoose } = require("mongoose");

mongoose.connect(
  "mongodb+srv://therafiali:G7YrwaZ8Wc4003fm@cluster0.ruz4rnf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

module.exports;