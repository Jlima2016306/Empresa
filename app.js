"use strict"

const bodyParser = require("body-parser");
//variables

const express = require("express");
const app  = express();

//IMPORTacion DE ruta
var usuario_rutas = require("./src/rutas/usuario.rutas")


app.use(bodyParser.urlencoded({extended:false}));
app.use (bodyParser.json());
//aplicacion de rutas localhost:3000/api/ejemplo
app.use("/api", usuario_rutas)

//Exportacion
module.exports = app;
