"use strict"

//IMPORTACIONES
var Usuario= require("../modelos/usuario.model");
var Empleados= require("../modelos/empleados.model.js");

var bcrypt= require("bcrypt-nodejs");
var jwt = require("../servicios/jwt");



//CREACION DE USUARIO ADMIN

function UserAdmin(req, res){
     var usuarioMode1 = Usuario();   
       usuarioMode1.Usuario= "Admin"
     usuarioMode1.rol="ROL_ADMIN"


     Usuario.find({
          
          Usuario: "Admin"
         

})

     .exec((err, adminoEncontrado )=>{
          if(err) return console.log({mensaje: "error en la peticion del admin"});
          if(adminoEncontrado.length >= 1){

               return console.log( "El admin siempre  estuvo listo! ");
     
               }else{
                    bcrypt.hash("123456", null, null, (err, passwordEncriptada)=>{
                         usuarioMode1.password = passwordEncriptada;

                         usuarioMode1.save((err, usuarioguardado) => {
                              if(err) return console.log({mensaje : "Error en la peticion Usuario"});

                              if(usuarioguardado){
                                   console.log("Admin listo!" )

                              }else{
                                   console.log({mensaje:"Admin triste, no vino"})
     

                              }
                         
                         })     
                    })
                    

               }

     })

}




function registrar(req, res){

var usuarioMode1 = Usuario();
var params = req.body;

if(params.Usuario && params.password){
 
      //modelo base de datos   datos del formulario
     usuarioMode1.Usuario = params.Usuario;
     

     usuarioMode1.rol = "ROL_USUARIO";

     Usuario.find({ Usuario: usuarioMode1.Usuario })

          
          .exec((err, usuariosEncontrados)=>{

               if(err) return res.status(500).send({mensaje: "error en la peticion de usuario"});
         
               if(usuariosEncontrados && usuariosEncontrados.length >= 1){

               return res.status(500).send({mensaje: "El usuario existe "});
     
               }else{
                    bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                         usuarioMode1.password = passwordEncriptada;

                         usuarioMode1.save((err, usuarioguardado) => {
                              if(err) return res.status(500).send({mensaje : "Error en la peticion Usuario"});

                              if(usuarioguardado){
                                   res.status(200).send({usuarioguardado})

                              }else{
                                   res.status(404).send({mensaje:"No se a podido guardar el usuario"})
     

                              }
                         
                         })     
                    })
                    

               }
          
          })



     }
}




function obtenerUsuario(req, res){

     if(req.user.rol != "ROL_ADMIN" ){
          return res.status(404).send({mensaje:"Por politicas de seguridad, solo admin puede ver a los usuarios"})
     }else{

     Usuario.find().exec((err, usuarios)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Usuarios"});

          if(!usuarios)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 

          return res.status(200).send((usuarios));
          

     })
     }

}

function obtenerUsuarioID(req,res){
     var params = req.body;
     var usuarioId = req.params.iDUsuario;
     
     if(req.user.rol != "ROL_ADMIN"){
          return res.status(500).send({mensaje:"Solo el Admin puede ver a los Usuarios por seguridad"})
     }

     Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la solicitud de usuario"});
          if(!usuarioEncontrado) return res.status(500).send({mensaje:"Error al obtener el usuario o no hay datos"});

          return res.status(200).send({usuarioEncontrado});



     })



}

function login(req,res){
     var params = req.body;
     Usuario.findOne({Usuario: params.Usuario}, (err, usuarioEncontrado)=> {
          if(err) return res.status(500).send({mensaje: "Error en la peticion"});

          if(usuarioEncontrado){
               
     
               bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{

                    if(passVerificada){
                         if(params.getToken == "true"){
                              return res.status(200).send({
                                   token: jwt.createToken(usuarioEncontrado)
                                   
                              })

                         }else{
                              usuarioEncontrado.password = undefined;
                              return res.status(200).send({usuarioEncontrado})
                              
                         }



                    }else{
                         return res.status(500).send({mensaje:"el usuario no se a podido identificar"})
                    }


               })


     }else{
          return res.status(500).send({mensaje:"error al buscar el usuario"})

     }
     
})

}


function editarUsuario(req, res)
{
     var iDUsuario= req.params.id;
     var params = req.body;


d     //borrar la propiedad password

     delete params.password;

     //SE VERIFICA QUE NO SE CREAN ADMINS!
     if(req.user.rol != "ROL_ADMIN"){

          if(iDUsuario != req.user.sub  ){
               return res.status(500).send({mensaje:"no se puede modificar otro usuario a menos que seas EL ADMIN"});


          }
     }

     Usuario.findByIdAndUpdate(iDUsuario, params, {new:true},(err, usuarioactualizado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la peticion"})
          if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido editat el usuario"});

          return res.status(200).send({usuarioactualizado});
     
     
     }
     )

}

function EliminarUsuario(req, res){
     let idUser= req.params.id

     if(req.user.rol ==="ROL_ADMIN" && req.user.sub === idUser){

          return res.status(400).send({mensaje:"Eliminar al admin es IMPOSIBLE, por favor no vuelva de intentarlo"})
     }

     if(req.user.sub != idUser && req.user.rol != "ROL_ADMIN" ){
          return res.status(500).send({mensaje:"No puedes eliminar a otro Usuario si no eres EL ADMIN"})
     }


          Usuario.findByIdAndDelete(idUser, (err, UsuarioEliminado)=>{
               if(err) return res.status(500).send({mensaje: "Error al eliminar al usuario"})
               if(!UsuarioEliminado) return res.status(500).send({mensajes:"Error al eliminar o El usuario ya ha sido eliminado"})
               
               Empleados.deleteMany({"empresa.idEmpresa": idUser}).exec((err, DE)=>{
                         if(err) return res.status(500).send({mensaje:"No se eliminaron los empleados"})
                         
               })
               
               return res.status(200).send({UsuarioEliminado})




          })


}






module.exports = { registrar, obtenerUsuario, obtenerUsuarioID, editarUsuario, login, UserAdmin, EliminarUsuario}