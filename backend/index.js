const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const mongoose = require("mongoose");
const { SECRET_PASSWORD } = require("./config");

const app = express();

const password = encodeURIComponent(SECRET_PASSWORD);

mongoose.connect(
  `mongodb+srv://pradyumnasavadatti7:${password}@ps-cluster.dzonnbv.mongodb.net/cohort?retryWrites=true&w=majority`
);

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.listen(15000, (err) => {
  console.log("Running on 15000");
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
  });
});
