const express = require("express")
const Students = require("../database/models/students");
const Materia = require('../database/models/materia');
const Image = require('../database/models/image');
const jwt = require('jsonwebtoken')
const fileUpload=require("express-fileupload")
const imgbbUploader = require("imgbb-uploader");
let fs = require('fs')
require('dotenv').config();
let path = require('path')

  const addStudents = async (req, res, next) => {

  const { firstName, lastName, dni, address, country, province, email, phone, status, cohorte } = req.body;

  const students = new Students({
    firstName: firstName,
    lastName: lastName,
    dni: dni,
    address: address,
    country: country,
    province: province,
    email: email,
    phone: phone,
    status: status,
    cohorte: cohorte
  })

  try {

    await students.save()
    res.send(students)
    res.json({
      status: "students created"
    })
  }
  catch (error) {
    next(error)
  }
}

const editStudents = async (req, res, next) => {
  const { firstName, lastName, dni,dateNac, address, country, province, username, phone, status, cohorte} = req.body;
  
  const newStudent = {
    firstName: firstName,
    lastName: lastName,
    dni: dni,
    dateNac:dateNac,
    address: address,
    country: country,
    province: province,
    username: username,
    phone: phone,
    status: status,
    cohorte: cohorte,
    //imagen:idImage
  }
  //const imagen=req.files.variable

  try {
    
    await Students.findByIdAndUpdate(req.params.id,newStudent,{ userFindModify: false })
    res.status(200).json({
      msg: "usuario actualizado"
    });

  } catch (error) {
    next(error)
  }
}

const uploadAvatar = async (req, res, next) => {
  try {
    let response = await imgbbUploader(process.env.API_KEY_IMGBB, path.join(__dirname, `../files/${req.file.filename}`))
    if(response){
      console.log(fs.existsSync(path.join(__dirname, '../files/' + req.file.filename)))
      if (fs.existsSync(path.join(__dirname, '../files/' + req.file.filename)) && req.file.filename !== "default-image.png") {
        fs.unlinkSync(path.join(__dirname,`../files/${req.file.filename}`))
      } else {
        console.log('no se encontro el archivo')
      }
    }
    await Students.findByIdAndUpdate(req.params.id, {avatar : response.url}, { userFindModify: false })
    res.status(200).json({
      msg: "usuario actualizado",
      response
    });
    // res.sendFile(path.join(__dirname,'../files/' + req.file.filename))
  } catch (error) {
    next(error)
  }
  
}



const getStudents = async (req, res) => {
  const students = await Students.find()

  try {
    await Students.find({}, function (err, students) {
      Materia.populate(students, { path: "materias" }, function (err, students) {
        res.status(200).json({
          students: students
        })
      })

    })
  } catch (error) {
    console.log(error)
  }

}


function verifyToken(req, res) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    console.log("ingreso aqui")
    const bearerToken=bearerHeader.split(" ")[1];
    req.token=bearerToken;
  }
  else {
    console.log("ingreso en el else")
    return res.status(403).json({ error: "no existe token" })
  }
}

const getStudentsId = async (req, res) => {
  // const student = await Students.findById(req.params.id)
  // res.json({
  //   student: student
  // })
  try {
    await Students.findById(req.params.id, {}, function (err, students) {
      Materia.populate(students, { path: "materias" }, function (err, students) {
        res.status(200).json({
          students: students
        })
      })
    })
  } catch (error) {
    console.log(error,"no existe el buscado")
    // res.status(204).json({
    //    error:"ususario no encontrado"
    // })
  }
 
}

const addMateriaStu = async (req, res) => {
  await Students.findById(req.params.id)

  const { idMateria } = req.body

  console.log(typeof idMateria)

  

  const materia = await Materia.findById(idMateria)
  const students = await Students.findById(req.params.id)
  if(materia&&students){
    students.materias.push(materia)
    await students.save()
    res.status(200).json({
      msg : "Materia Asignada"
    });
  }else
  res.status(204).json({
    msg:"materia o estudiante no encontrado"
  })
}

module.exports = {
  addStudents,
  getStudents,
  getStudentsId,
  addMateriaStu,
  editStudents,
  uploadAvatar
}