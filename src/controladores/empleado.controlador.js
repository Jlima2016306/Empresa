"use strict"

//IMPORTACIONES
var Empleados= require("../modelos/empleados.model.js");
const pdf = require('pdfkit');
const fs = require("fs");
var moment= require("moment");
const date = require('date-and-time');




//Aqui se ingresa el empleado, tome en cuenta que en los usuarios se pueden repetir cosas. Y la empresa se autopone con su token
//El admin no puede tener empleados por qué no es una empresa, así que lo evalue con el rol que se encuentra en el rol 

function ingresarEmpleado(req, res){

//en esta variable guardo el modelo
var EmpleadosModel = new Empleados();

//esto lo pido del body
var params = req.body;

//Aquí se verifica que sea una empresa
if(req.user.rol != "ROL_USUARIO"  ){
    return res.status(500).send({mensaje:"Losiento Admin pero sin empresa no hay empleados"})
}else{
     //Sin esto datos en el body no hay empleados
     if(params.Nombre && params.Puesto && params.Departamento){
          //modelo base de datos   datos del formulario
          EmpleadosModel.empresa = {Nombre: req.user.Usuario,
                                   idEmpresa: req.user.sub,
                                   EmpleadosReg: []};
     
          EmpleadosModel.Nombre = params.Nombre;

          EmpleadosModel.Puesto = params.Puesto;

          EmpleadosModel.Departamento = params.Departamento;

          
     //Decidi no hacer busquedas, por qué pueden haber multiples usuarios con el mismo nombre
     //el mismo puesto  y el mismo departamento, así que lo que los identifica como unidad es la ID

                         //antes de guardar se verifica que no hallán errores, para evitar problemas posteriores    
          EmpleadosModel.save((err, EmpleadoGuardado) => {
               if(err) return res.status(500).send({mensaje : "Error en la peticion Empleado"});

               if(EmpleadoGuardado){return res.status(200).send({EmpleadoGuardado})

               }else{
                               res.status(404).send({mensaje:"No se a podido guardar el Usuario"})
     

               }
                         
          })     
                    

     }else{
          return res.status(404).send({mensaje:"Usted cometio un error en los parametros"})
          }
}

}


   
//aqui se hara el listar empleados, pero ojo. Habran dos formas
//1- El admin podra ver todos los empleados de todas las empresas
//2- La empresa solo vera sus empleados 

function obtenerEmpleados(req, res){

    if(req.user.rol != "ROL_ADMIN"  ){
    
    //2
     Empleados.find({'empresa.idEmpresa' : req.user.sub}).exec((err, Empleados)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

          if(!Empleados)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 

          return res.status(200).send({Empleados});
          

     })

    }else{
    //1
        Empleados.find().exec((err, Empleados)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!Empleados)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((Empleados));

    })

}

}


//por id
function obtenerEmpleadosID(req, res){
     var params = req.body;

    var EmpID = req.params.EmpleadoID

    if(req.user.rol != "ROL_ADMIN"  ){
    
    //2
    Empleados.find( {_id: EmpID, 'empresa.idEmpresa' : req.user.sub} ).exec((err, Empleadoss)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

          if(!Empleadoss)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 

               if(Empleadoss.length === 0 ) return res.status(404).send({mensaje:"Ese empleado no se encuentra en la empresa"})

          return res.status(200).send((Empleadoss));
     

     })

    }else{
    //1
        Empleados.findById(EmpID, (err, empleadoss)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!empleadoss)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((empleadoss));

    })

}

}





//buscar por nombre   
function  obtenerEmpleadosNombre(req, res){
     var params = req.body;

    var EmpleadoNombre = req.params.EmpleadoNombre
    if(req.user.rol != "ROL_ADMIN"  ){
    
    //2
     Empleados.find( {'empresa.idEmpresa' : req.user.sub,  Nombre: EmpleadoNombre }).exec((err, Empleadoss)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

          if(!Empleadoss)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
          
          if(Empleadoss.length === 0 ) return res.status(404).send({mensaje:"Ese empleado no se encuentra en la empresa"})

          return res.status(200).send((Empleadoss));
          

     })

    }else{
    //1
        Empleados.find({Nombre: EmpleadoNombre}).exec((err, Empleadoss)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!Empleadoss)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((Empleadoss));

    })
    }
}


//buscar por puesto

function obtenerEmpleadosPuesto(req, res){
     var params = req.body;

    var EmpleadoPuestod = req.params.EmpleadoPuesto
    if(req.user.rol != "ROL_ADMIN"  ){
    
    //2
     Empleados.find({'empresa.idEmpresa' : req.user.sub, Puesto:EmpleadoPuestod }).exec((err, Empleadoss)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

          if(!Empleadoss)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
             

               if(Empleadoss.length === 0 ) return res.status(404).send({mensaje:"Ese empleado no se encuentra en la empresa o el puesto no existe"})


          return res.status(200).send((Empleadoss));
          

     })

    }else{
    //1
        Empleados.find({Puesto: EmpleadoPuestod}).exec((err, Empleados)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!Empleados)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((Empleados));

    })
    }
}


//buscar por departamento

function obtenerEmpleadosDepartamento(req, res){
     var params = req.body;

    var EmpleadoDepartamentos = req.params.EmpleadoDepartamento
    if(req.user.rol != "ROL_ADMIN"  ){
    
    //2
     Empleados.find({'empresa.idEmpresa' : req.user.sub , Departamento:EmpleadoDepartamentos }).exec((err, Empleadoss)=>{
          if(err) 
               return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});

          if(!Empleadoss)
               return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 

          if(Empleadoss.length === 0 ) return res.status(404).send({mensaje:"Ese empleado no se encuentra en la empresa"})


          return res.status(200).send((Empleadoss));
          

     })

    }else{
    //1
        Empleados.find({Departamento: EmpleadoDepartamentos}).exec((err, Empleadoss)=>{
            if(err) 
                 return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
  
            if(!Empleadoss)
                 return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
  
            return res.status(200).send((Empleadoss));

    })
    }
}


function createInvoice(invoice,Otro,Fech,path) {
  let doc = new pdf({ margin: 50 });

  doc.image('imagenes/logo.png', {fit: [100, 100],aling:"left" }).moveDown()

  doc.text("Empleados de Empresa: "+ Otro,152,50,{fontSize:14} )
  .text("Fecha:"+Fech,0,50,{  align: "right",fontSize:18}).moveDown()
  doc.text("No. Empleados: "+invoice.length,152,70,{fontSize:18} )
 
  TInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);


  doc.end();
  doc.pipe(fs.createWriteStream("../PROYECTO/EmpleadosEmpresa"+ Otro +"_"+Fech+".pdf" ));
}



function TInformation(doc) {
   
     doc
       .text(`Nombre: `, 50, 210)
       .text(`Puesto: `, 150, 210)
       .text(`Departamento:`, 280, 210)


       .moveDown();
    
      
   }

   function generateTableRow(doc, y, c1, c2, c3) {
     doc
       .fontSize(10)
       .text(c1, 50, y)
       .text(c2, 150, y)
       .text(c3, 280, y)
 
   }

   function generateInvoiceTable(doc, invoice) {
     let i,
       invoiceTableTop = 215;
   
     for (i = 0; i < invoice.length; i++) {
       const item = invoice[i];
       const position = invoiceTableTop + (i + 1) * 30;
       generateTableRow(
         doc,
         position,
         
         item.Nombre,
         item.Puesto,
         item.Departamento,
     
       );
     }
   }




function editarEmpleado(req, res)
{
     var iDEmpleado= req.params.id;
     var params = req.body;


     //borrar la propiedad password

     delete params.password;

     //SE VERIFICA QUE NO SE CREAN ADMINS!
     if(req.user.rol != "ROL_ADMIN"){

          Empleados.find({'empresa.idEmpresa' : req.user.sub , _id: iDEmpleado}).exec((err, Empleados)=>{
               if(err) 
                    return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
     
               if(!Empleados)
                    return res.status(500).send({mensaje:"Error en la consulta de Usuarios o el empleado no le pertenece "}); 
     
     
                    if(Empleados.length === 0 ){ return res.status(404).send({mensaje:"El empleado no se encuentra en la empresa"})
          }

          })
          
     }

     Empleados.findByIdAndUpdate(iDEmpleado, params, {new:true},(err, usuarioactualizado)=>{
          if(err) return res.status(500).send({mensaje:"Error en la peticion"})
          if(!usuarioactualizado) return res.status(500).send({mensaje:"No se ha podido editat el usuario"});

          return res.status(200).send({usuarioactualizado});
     
     
     }
     )

}

function ImprimirPdf(req, res){
     if(req.user.rol != "ROL_ADMIN"  ){
    
          //2
           Empleados.find({'empresa.idEmpresa' : req.user.sub},{"Nombre":1, "Puesto":1,"Departamento":1,"_id":0 }).exec((err, Empleadoss)=>{
                if(err) 
                     return res.status(500).send({mensaje:"Error en la peticion obtener Empleados"});
      
                if(!Empleadoss)
                     return res.status(500).send({mensaje:"Error en la consulta de Usuarios o No tienes datos "}); 
                     const now = new Date();
               var fech = date.format(now, 'YYYY-MM-DD hhA');
               
               createInvoice(Empleadoss, req.user.Usuario,fech);

                return res.status(200).send({Empleadoss});
                
      






           })
      
          }else{
          //1
             return res.status(500).send({mensaje:"Por politicas de seguridad, el admin no puede obtener pdf de los empleados"})
      
          
      
      }
      
      }
      
function EliminarEmpleado(req, res){
          let idUser= req.params.id
     
          Empleados.find({"empresa.idEmpresa":req.user.sub, _id: idUser } ).exec((err, EsEmpleado)=>{
          if(err) return res.status(500).send({mensaje:"Error al Eliminar el Empleado"})
          if(EsEmpleado.length == 0) return res.status(404).send({mensaje:"El empleado no esta en la empresa"})
          
          Empleados.findByIdAndDelete(idUser, (err, EmpleadosEliminado)=>{
               if(err) return res.status(500).send({mensaje: "Error al eliminar al usuario"})
               if(!EmpleadosEliminado) return res.status(500).send({mensajes:"Error al eliminar o El usuario ya ha sido eliminado"})
               return res.status(200).send({EmpleadosEliminado})
          })
          
          }
          )
     
        
     
     

     
     
     
     
     
          }
     




module.exports = {    ingresarEmpleado, 
                        editarEmpleado, 
                        obtenerEmpleadosDepartamento,
                         obtenerEmpleadosPuesto,
                        obtenerEmpleadosNombre,
                    obtenerEmpleadosID,
                obtenerEmpleados, ImprimirPdf, EliminarEmpleado}