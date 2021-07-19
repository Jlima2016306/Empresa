//SyntaxError: Invalid shorthand property initializer

const mongoose = require("mongoose")
const app = require("./app")
var UsuarioControlador = require("./src/controladores/usuario.controlador");



mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/proyectoDB", {useNewUrlParser: true, useUnifiedTopology:  true}).then(()=>{
    console.log("conectado!");
    
    app.listen(3000, function()  {
        console.log("servidor corriendo puerto 3000")
        
        UsuarioControlador.UserAdmin();
    

    })

}).catch(err => console.log(err))  



