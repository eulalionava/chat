var socket = io();
//OBTENER LAS VARIABLES ENVIADAS POR URL
var params = new URLSearchParams(window.location.search);

if( ! params.has('nombre')){
    window.location = 'index.html';
    throw new Error('El nombre es necesario');
}

var usuario = {
    nombre:params.get('nombre')
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
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});