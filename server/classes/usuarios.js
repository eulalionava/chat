class Usuarios{
    constructor(){
        this.personas = [];
    }
    //FUNCION QUE AGREGA PERSONAS
    agregarPersona(id,nombre,sala){
        let persona = {id,nombre,sala};

        this.personas.push(persona);
        return this.personas;
    }

    //OBTENER UNA PERSONA EN PARTICULAR
    getPersona(id){
        let persona = this.personas.filter(persona=>persona.id === id)[0];

        return persona;
    }

    //REGRESAR TODAS LAS PERSONAS QUE SE ENCUENTRAN EN EL CHAT
    getPersonas(){
        return this.personas;
    }

    //OBTIENE LAS PERSONAS POR SALA DE CHAT
    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter(persona =>persona.sala === sala);
        return personasEnSala;
    }

    //ELIMINA UNA PERSONA ,QUE SALE DEL CHAT
    borrarPersona(id){
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;
    }

}

module.exports ={
    Usuarios
}