/*
    2C = Two of Clubs (tréboles) 
    2D = Two of Diamonds (Diamantes)
    2H = Two of Hearts (Corazones)
    2S = Two of Spades (Espadas)
*/

// patron modulo
// funcion flecha anonima y autoinvocada;
const myModulo = (() => {
    'use strict'

    let deck = [];
    const tipos = ["C","D","H","S"];
    const especiales = ["A","J","Q","K"]; // cartas especiales
    
    let puntosJugadores = [];

    // Referencias del html
    const btnPedir = document.querySelector("#btnPedir");
    const btnNuevo = document.querySelector("#btnNuevo");
    const btnDetener = document.querySelector("#btnDetener");
    const puntosHtml = document.querySelectorAll(".puntuacion"); 
    const divCartasJugadores = document.querySelectorAll(".divCartas");
    const mensajeModal = document.querySelector("#mensajeModal");

    // ******************************************************
    // ******************* [ Funciones ] ********************
    // ******************************************************

    // esta funcion inicializa el juego
    const inicializarJuego = ( numeroDeJugadores = 2 )=>{
        // el ultimo jugador siempre será la computadora
        deck = crearDeck();
        puntosJugadores = [];
        for(let i = 0; i < numeroDeJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHtml.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;

    }

    // esta funcion crea un nuevo deck
    const crearDeck = () => {

        deck = [];
        for(let i = 2; i <= 10; i++){
            for(let tipo of tipos)
            {
                deck.push(i + tipo);
            }
        }

        for(let tipo of tipos){
            for(let especial of especiales){
                deck.push(especial+tipo);
            }
        }

        return _.shuffle(deck);
    }

    // esta funcion permite tomar una carta
    const pedirCarta = () => {
        // debe tomar una carta aleatoria del deck
        // y retornar dicha carta, debe restar esa carta 
        // al deck
        if(deck.length === 0)
        {
            abrirModal("text-info","Por el momento no hay cartas en el deck");
        }
        else {
            return deck.pop();
        }
    }

    // valor carta
    const valorCarta = (carta) => {
        // isNaN evalua si lo que se envia es un numero o no, 
        // si No es un numero retorna true, si ES un numero retorna false
        const valor = carta.substring(0, carta.length-1);
        return (isNaN(valor)) ? 
               (valor === "A") ? 11 : 10 
               : valor * 1;
    }

    // turno de la computadora
    const turnoComputadora = (puntosMinimos)=>{
        // puntosMinimos = a los puntos acumulados por el jugador
        let puntosComputadora = 0;
        do {
                const carta = pedirCarta();
                puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
                crearCarta(carta, puntosJugadores.length - 1);

        } while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        determinarGanador(puntosMinimos, puntosComputadora);

    }

    // abrir modal
    const abrirModal = (text_color, msg) => {
        mensajeModal.innerText = msg;
        mensajeModal.classList.remove("text-danger");
        mensajeModal.classList.remove("text-success");
        mensajeModal.classList.remove("text-info");
        mensajeModal.classList.add(text_color);
        $("#modalResultado").modal("show");
    }

    // acumular puntos jugador
    // Turno: 0 = primer jugador, el último turno es el de la computadora
    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[turno] =  puntosJugadores[turno] + valorCarta(carta);
        puntosHtml[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {

        const imgCarta = document.createElement("img");
              imgCarta.src = `assets/cartas/${carta}.png`;
              imgCarta.classList.add("carta");
              divCartasJugadores[turno].append(imgCarta);

    }

    const determinarGanador = (puntosMinimos, puntosComputadora) => {

        if(puntosComputadora == puntosMinimos){
            abrirModal("text-info", "Nadie Gana")
        }
        else if (puntosMinimos > 21){
            abrirModal("text-danger", "¡Computadora Gana!")
        }
        else if (puntosComputadora > 21){
            abrirModal("text-success",  "¡Jugador Gana!")
        } else {
            abrirModal("text-danger",  "¡Computadora Gana!")
        } 
    }

    // ****************************************************
    // ******************* [ Eventos ] ********************
    // ****************************************************

    btnPedir.addEventListener("click", () =>{
        const carta = pedirCarta();
        let puntosJugador = acumularPuntos(carta, 0);

        // insertar carta
        crearCarta(carta, 0);

        if (puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        } else if (puntosJugador === 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });

    btnDetener.addEventListener("click", ()=>{
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    });

    btnNuevo.addEventListener("click",() => {

        inicializarJuego();


    });

    // se retorna un objeto con aquellas funciones / elementos 
    // que quiero que sean publicos
    return {
        nuevoJuego: inicializarJuego // en este caso la funcion "inicializarJuego" es publica y 
                                    // puede ser accedida llamando al modulo: myModulo.inicializarJuego();
    };

})();



