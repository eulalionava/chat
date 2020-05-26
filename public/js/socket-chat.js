var socket = io();
//OBTENER LAS VARIABLES ENVIADAS POR URL
var params = new URLSearchParams(window.location.search);

if( ! params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var usuario = {
    nombre:params.get('nombre'),
    sala:params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    //ver quien se conecta al chat
    socket.emit('entrarChat',usuario,function(response){
        console.log('Usuarios conectados:' , response);
    })


});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('enviarMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//Escuchar cambios de usuario
//cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log(personas);

});

//mensaje privado
socket.on('mensajePrivado',function(mensaje){
    console.log("Mensaje privado ",mensaje);
})
