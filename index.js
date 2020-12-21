require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

// connect mongoDB
mongoose
  .connect(process.env.URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
    console.log("can not connect database");
  });

// express config
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

// middlware place

// config third party moudules
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));

// import router
const commentRouter = require("./routers/commentRouter");
const postAccommodationRouter = require("./routers/accomodationPostRouter");
const ratingRouter = require("./routers/ratingRouter");
const userRouter = require("./routers/usersRouter");
const ownerRouter = require("./routers/ownerRouter");
const adminRouter = require("./routers/adminRouter");
// Router place
app.use("/accommodationPost", postAccommodationRouter);
app.use("/rating", ratingRouter);
app.use("/user", userRouter);
app.use("/owner", ownerRouter);
app.use("/admin", adminRouter);
app.use("/comment", commentRouter);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  );
  if (req.method === "OPTIONS") {
    req.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Router config place

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
