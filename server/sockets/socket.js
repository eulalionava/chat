const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');

const { Usuarios }  = require('../classes/usuarios');

const usuarios = new Usuarios();
let cantidadDeMensajes = 0;

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
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${ data.nombre } se unió`));

        callback(usuarios.getPersonasPorSala(data.sala));
        
    });

    //FUNCION QUE CREA EL MENSAJE
    client.on('crearMensaje',(data,callback)=>{
        let persona = usuarios.getPersona(client.id);
        //crear mensaje
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        //emitir mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);

        //regresa el mensaje
        callback(mensaje);
    })

    //DESCONEXION DEL CHAT
    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersona(client.id);
        
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));

        //Toda las personas que se encuentran en el chat
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala));
    })

    client.on('getPersonaPrivada',(data,callback)=>{
        let persona = usuarios.getPersona(data.id);
        persona.contMsj = 0;
        callback(persona)
    })

    //MENSAJES PRIVADOS
    client.on('mensajePrivado',(data,callback)=>{
        //Persona particular
        let persona = usuarios.getPersona(client.id);

        persona.contMsj = persona.contMsj + 1;
        //Emite el mensaje a una persona especifica
        let emitirMensaje = crearMensaje(persona.nombre,data.mensaje);

        client.broadcast.to(data.para).emit('mensajePrivado',emitirMensaje );

        //Renderiza nuevamente los usuarios y mostrar si hay un mensaje nuevo
        client.broadcast.to(persona.sala).emit('listaPersona',usuarios.getPersonasPorSala(persona.sala));
        callback(emitirMensaje);
    });

    //ACTUALIZA NUEVAMENTE LOS USUARIOS Y VACIANDO LOS MENSAJES NUEVOS
    client.on('actualizarUsuarios',()=>{

        let persona = usuarios.getPersona(client.id);
        persona.contMsj = 0;
        client.broadcast.to(persona.sala).emit('listaPersona',usuarios.getPersonasPorSala(persona.sala));
    });

});