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
const Students = require("./database/models/students");
const Teacher = require("./database/models/teacher");
const morgan = require('morgan');

const routes = require('./routes/api');
const materiaRoutes = require('./routes/materiaRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const classesRoutes = require('./routes/classesRoutes')
//const studentsRoutes=require('./routes/studentsRoutes')
const tasksRoutes = require('./routes/tasksRoutes')
const cohorteRoutes = require('./routes/cohorteRoutes')
const studentsRoutes = require('./routes/studentsRoutes')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const PORT = process.env.PORT || 3001; // Step 1
const getStudentsId = require("./controllers/students.controller")
const Image = require("./database/models/image");
const fileUpload = require("express-fileupload")

//----------------------------------------- END OF IMPORTS---------------------------------------------------
mongoose.connect(
  process.env.DB_MONGO || 'mongodb://localhost/mern_youtube',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
  }
);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.HOST_FRONT, // <-- location of the react app were connecting to
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

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))

app.post("/postImage/:idStudent", async function (req, res)  {
  // const imagen = req.files.variable
  // console.log(imagen)

  let data = {
    producto_nombre: "prueba nombre"
  }

  let modelImagen = new Image(data)

  modelImagen.imagen.data = req.files.variable.data
  modelImagen.imagen.contentType = req.files.variable.mimetype

  const student=await Students.findById(req.params.idStudent)
  modelImagen.student=student
  modelImagen.save((err, rpta) => {
    if (err) {
      res.json({
        err: err
      })
    }
    res.json({
      result: true
    })
  })
student.image=modelImagen.imagen.data

  await Students.findByIdAndUpdate(req.params.idStudent,modelImagen.imagen.data,{ userFindModify: false })
})


app.get("/imagen/:id", (req, res) => {
  let id = req.params.id
  Image.findById(id).exec((err, rpta) => {
    if (err) {
      res.json({
        err: err
      })
    }
    res.set("Content-type", rpta.imagen.contenType)
    return res.send(rpta.imagen.data)
  })
  
})
/////////////////////////////