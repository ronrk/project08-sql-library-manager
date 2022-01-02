var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const db = require("./models");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

//checking connection to database
try {
  db.sequelize.authenticate();
  console.log("Connect to database succesfuly");
} catch (error) {
  console.error("Connect to database failed", error);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("404 error handler");
  res.status(404).render("page-not-found");
});

// error handler
app.use(function (err, req, res, next) {
  if (err) {
    console.log("global error occured");
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status === 404) {
    res.status(404).render("page-not-found", { err, title: "Page Not Found" });
  } else {
    // render the error page
    err.message = err.message || "Oops! something wrong with the server";
    res
      .status(err.status || 500)
      .render("error", { err, title: "Server Error" });
  }
});

module.exports = app;
