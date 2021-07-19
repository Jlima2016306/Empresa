"use strict"

var express = require("express");
var UsuarioControlador = require("../controladores/usuario.controlador");
var EmpleadoControlador = require("../controladores/empleado.controlador");

var md_autorizacion = require("../middlewares/authenticated.js");

//RuTas
var api = express.Router()
api.post("/registrar", UsuarioControlador.registrar)
api.get("/obtenerUsuarios", md_autorizacion.ensureauth ,UsuarioControlador.obtenerUsuario)
api.post("/login", UsuarioControlador.login)
api.get("/obtenerUsuarioID/:iDUsuario", md_autorizacion.ensureauth ,UsuarioControlador.obtenerUsuarioID)
api.put("/editarUsuario/:id", md_autorizacion.ensureauth, UsuarioControlador.editarUsuario)
api.put("/eliminarUsuario/:id",md_autorizacion.ensureauth, UsuarioControlador.EliminarUsuario)

api.put("/ingresarEmpleado", md_autorizacion.ensureauth, EmpleadoControlador.ingresarEmpleado );
api.get("/obtenerEmpleados", md_autorizacion.ensureauth, EmpleadoControlador.obtenerEmpleados);
api.get("/obtenerEmpleadosID/:EmpleadoID", md_autorizacion.ensureauth, EmpleadoControlador.obtenerEmpleadosID);
api.get("/obtenerEmpleadosPuesto/:EmpleadoPuesto", md_autorizacion.ensureauth, EmpleadoControlador.obtenerEmpleadosPuesto);
api.get("/obtenerEmpleadosDepartamento/:EmpleadoDepartamento", md_autorizacion.ensureauth, EmpleadoControlador.obtenerEmpleadosDepartamento);
api.get("/obtenerEmpleadoNombre/:EmpleadoNombre", md_autorizacion.ensureauth,EmpleadoControlador.obtenerEmpleadosNombre);
api.put("/editarEmpleado/:id", md_autorizacion.ensureauth, EmpleadoControlador.editarEmpleado )
api.put("/eliminarEmpleado/:id",md_autorizacion.ensureauth, EmpleadoControlador.EliminarEmpleado)


api.get("/ImprimirPdf", md_autorizacion.ensureauth, EmpleadoControlador.ImprimirPdf);


//ingresarEmpleado, editarEmpleado, obtenerEmpleadosDepartamento,
    //                     obtenerEmpleadosPuesto, obtenerEmpleadosNombre, obtenerEmpleadoID,obtenerEmpleados}


module.exports = api;
