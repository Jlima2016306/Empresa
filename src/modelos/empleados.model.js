"use strict"

const { suppressDeprecationWarnings } = require("moment");
var mongoose =require("mongoose");
var Schema = mongoose.Schema;


var EmpleadosSchema = Schema({
    empresa:[{
        Nombre: String,
        idEmpresa:{type: Schema.Types.ObjectId, ref:"usuario"},
        EmpleadosReg:[]

    }],
    Nombre:String,
    Puesto : String,
    Departamento: String,




});



module.exports =mongoose.model("empleados", EmpleadosSchema);