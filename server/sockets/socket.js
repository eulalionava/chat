const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

const { Usuarios }  = require('../classes/usuarios');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    //ENTRADA AL CHAT
    client.on('entrarChat',(data,callback)=>{
        
        if( !data.nombre){
            return callback({
                error:true,
                mensaje:'El nombre es necesario'
            })
        }

        //agregamos usario
        let personas = usuarios.agregarPersona(client.id,data.nombre);
        //Toda las personas que se encuentran en el chat
        client.broadcast.emit('listaPersona',usuarios.getPersonas());
        callback(personas);
        
    });

    //FUNCION QUE CREA EL MENSAJE
    client.on('crearMensaje',(data)=>{
        let persona = usuarios.getPersona(client.id);
        //crear mensaje
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        //emitir mensaje
        client.broadcast.emit('crearMensaje',mensaje);
    })

    //DESCONEXION DEL CHAT
    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        
        client.broadcast.emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));

        //Toda las personas que se encuentran en el chat
        client.broadcast.emit('listaPersona',usuarios.getPersonas());
    })

});