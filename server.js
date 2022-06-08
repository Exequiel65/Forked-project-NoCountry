const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const User = require("./database/models/users");
const morgan = require('morgan');

const routes = require('./routes/api'); 
const materiaRoutes=require('./routes/materiaRoutes')
const teacherRoutes=require('./routes/teacherRoutes')
const classesRoutes=require('./routes/classesRoutes')
//const studentsRoutes=require('./routes/studentsRoutes')
const tasksRoutes=require('./routes/tasksRoutes')
const cohorteRoutes=require('./routes/cohorteRoutes')
const studentsRoutes=require('./routes/studentsRoutes')
//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  "mongodb+srv://AulaVirtual2022:nocountryvirtual@aulavirtual.9kdbn.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

// Routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});
app.post("/register", (req, res) => {
  User.findOne({ username: req.body.username }, async (err, doc) => {
    if (err) throw err;
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      res.send("User Created");
    }
  });
});
app.get("/user", (req, res) => {
  res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});
//----------------------------------------- END OF ROUTES---------------------------------------------------
//Start Server
app.listen(3001, () => {
  console.log("Server Has Started");
});


/////////////////////
app.use(morgan('tiny'));
app.use('/api', routes);
app.use('/api', teacherRoutes);
app.use('/api', classesRoutes);
app.use('/stu', studentsRoutes);
app.use('/api', tasksRoutes);
app.use('/mat', materiaRoutes);
app.use('/coho', cohorteRoutes);
/////////////////////////////