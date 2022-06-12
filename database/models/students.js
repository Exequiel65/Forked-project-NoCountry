const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const students = new Schema({
    firstName: { type: String, require: false },
    lastName: { type: String, require: false},
    dni: { type: Number, require: false },
    address: { type: String, require: false },
    country: { type: String, require: false },
    province: { type: String, require: false },
    username: { type: String, require: false },
    phone: { type: Number, require: false },
    materias: [{
        type: Schema.Types.ObjectId,
        ref: 'Materia'
    }],
    status: { type: Boolean, require: false },
    cohorte:{type:String,reuire:false},
    password:{type:String,require:false},
    imagen:{
        data:Buffer,
        contentType:String
    }
})

module.exports = mongoose.model('Students', students);

