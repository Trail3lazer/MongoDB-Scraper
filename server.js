//my_modules
var api = require("./routes/apiRoutes");
var htmlRoutes = require("./routes/htmlRoutes")

//node_mods
var express = require("express");
var mongoose = require("mongoose");
var hbrs = require("express-handlebars");

// DB connection
require('dotenv').config()

var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI) //, { useNewUrlParser: true ,useUnifiedTopology: true});
.then(()=>console.log("DB connected"))
// Initialize Express

var app = express();

// hbrs engine

app.engine("handlebars", hbrs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Parse request body as JSON

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder

app.use(express.static("public"));

// Routes

api(app, db);
htmlRoutes(app, db);


// Start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(MONGODB_URI)
  console.log("App running on port http://localhost:" + PORT + "/ !");
});
