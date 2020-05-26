const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

const { Usuarios }  = require('../classes/usuarios');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    //ENTRADA AL CHAT
    client.on('entrarChat',(data,callback)=>{
        console.log(data);
        if( !data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje:'El nombre y sala es necesario'
            })
        }

        //sala
        client.join(data.sala);

        //agregamos usario
        usuarios.agregarPersona(client.id,data.nombre,data.sala);
        //Toda las personas que se encuentran en el chat por sala
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala));
        callback(usuarios.getPersonasPorSala(data.sala));
        
    });

    //FUNCION QUE CREA EL MENSAJE
    client.on('crearMensaje',(data)=>{
        let persona = usuarios.getPersona(client.id);
        //crear mensaje
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        //emitir mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
    })

    //DESCONEXION DEL CHAT
    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));

        //Toda las personas que se encuentran en el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    //MENSAJES PRIVADOS
    client.on('mensajePrivado',data=>{
        let persona = usuarios.getPersona(client.id);
        //Emite el mensaje a una persona especifica
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));
    })

});