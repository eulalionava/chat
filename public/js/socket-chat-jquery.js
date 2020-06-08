//OBTENER LAS VARIABLES ENVIADAS POR URL
var params = new URLSearchParams(window.location.search);

// referencias
var divUsuarios = $('#divUsuarios');
var formEnviar = $("#formEnviar");
var formEnviarPrivado = $("#formEnviarPrivado");
var txtMensaje = $("#txtMensaje");
var divChatbox = $("#divChatBoxSala");
var divChatPrivado = $("#divChatBoxPrivado");
var nombrePrivado = $("#nombrePrivado");

var idPersona = "";
var nombre = params.get('nombre');
var sala = params.get('sala');

// / Funciones para renderizar usuarios
function renderizarUsuarios(personas) { // [{},{},{}]

    console.log(personas);

    var html = '';

    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {

        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/user_chat.png" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);

}

//RENDERIZAR LOS MENSAJES A LA PANTALLA PRINCIPAL
function renderizarMensajes(mensaje,yo){
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';
    if (mensaje.usuario === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.usuario + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/user_chat.png" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    } else {

        html += '<li class="animated fadeIn">';

        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/user_chat.png" alt="user" /></div>';
        }

        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.usuario + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }

    divChatbox.append(html);
}

//RENDERIZAR LOS MENSAJES PRIVADOS
function renderizarMensajesPrivados(mensaje,yo){
    var html = '';

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+mensaje.usuario+'</h5>';
        html += '        <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/user_chat.png" alt="user" /></div>';
        html += '    <div class="chat-time"></div>';
        html += '</li>';
    

        divChatPrivado.append(html);
}

//Juega con el scroll con forme se va escribiendo y mandando los mensajes
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//EVENTOS QUE VERIFICA EL ID DEL LA PERSONA EN LINEA
divUsuarios.on('click','a',function(){
    var id = $(this).data('id');

    if(id){
        console.log(id);
        $("#chatPrivado").css('display','block')
        $("#chatSala").css('display','none');
        formEnviar.css('display','none');
        formEnviarPrivado.css('display','block');

        idPersona = id;

        //Emite para obtener la persona que se le enviara el mensaje
        socket.emit('getPersonaPrivada',{id:idPersona},function(data){
            console.log(data);
            nombrePrivado.html("<p> Charlando con: "+data.nombre+"</p>");

        });
    }
});

//EVENTO PARA ENVIAR MENSAJES
formEnviar.on('submit',function(e){
    e.preventDefault();


    if(txtMensaje.val().trim().length === 0){
        return;
    }

    // Crear mensaje
    socket.emit('crearMensaje', {
        usuario: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        console.log('Tu mensaje fue enviado: ', mensaje);
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje,true);
        scrollBottom();
    });

})

///EVENTOS PARA MANDA MENSAJES PRIVADOS
formEnviarPrivado.on('submit',function(e){
    e.preventDefault();
    
    let msj = $("#txtMensajePrivado").val();
    
    $("#txtMensajePrivado").val('');

    socket.emit('mensajePrivado',{mensaje:msj,para:idPersona},function(mensaje){
        console.log("Emisor:",mensaje);
        renderizarMensajesPrivados(mensaje,true);
    })

})