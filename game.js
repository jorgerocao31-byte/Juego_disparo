const canvas = document.getElementById("game");

const ctx = canvas.getContext("2d");


// =========================
// TAMAÑO DE LA PANTALLA
// =========================

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;


// =========================
// ESTADO DEL JUEGO
// =========================

let jugando = false;

let pausado = false;


// =========================
// JUGADOR
// =========================

let jugador = {

    x: canvas.width / 2,

    y: canvas.height / 2,

    tamaño: 25,

    velocidad: 5,

    vida: 100

};


// =========================
// BALAS
// =========================

let balas = [];


// =========================
// ENEMIGOS
// =========================

let enemigos = [];


// =========================
// PUNTOS
// =========================

let puntos = 0;


// =========================
// TECLAS
// =========================

let teclas = {};


// =========================
// MOUSE
// =========================

let mouse = {

    x: canvas.width / 2,

    y: canvas.height / 2

};


// =========================
// TECLADO
// =========================

document.addEventListener("keydown", (e) => {

    teclas[e.key.toLowerCase()] = true;

});


document.addEventListener("keyup", (e) => {

    teclas[e.key.toLowerCase()] = false;

});


// =========================
// PAUSA CON ESC
// =========================

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && jugando) {

        if (pausado) {

            continuarJuego();

        } else {

            pausarJuego();

        }

    }

});


// =========================
// MOUSE
// =========================

canvas.addEventListener("mousemove", (e) => {

    mouse.x = e.clientX;

    mouse.y = e.clientY;

});


canvas.addEventListener("mousedown", () => {

    if (jugando && !pausado) {

        disparar();

    }

});


// =========================
// INICIAR JUEGO
// =========================

function iniciarJuego() {

    jugador.x = canvas.width / 2;

    jugador.y = canvas.height / 2;

    jugador.vida = 100;


    balas = [];

    enemigos = [];

    puntos = 0;


    pausado = false;

    jugando = true;


    document.getElementById("vida").textContent = jugador.vida;

    document.getElementById("puntos").textContent = puntos;


    document.getElementById("menu").style.display = "none";

    document.getElementById("pausa").style.display = "none";

    document.getElementById("gameOver").style.display = "none";

    document.getElementById("hud").style.display = "block";


    juego();

}


// =========================
// PAUSAR
// =========================

function pausarJuego() {

    pausado = true;

    document.getElementById("pausa").style.display = "flex";

}


// =========================
// CONTINUAR
// =========================

function continuarJuego() {

    pausado = false;

    document.getElementById("pausa").style.display = "none";

}


// =========================
// VOLVER AL MENÚ
// =========================

function volverAlMenu() {

    jugando = false;

    pausado = false;


    enemigos = [];

    balas = [];


    document.getElementById("pausa").style.display = "none";

    document.getElementById("gameOver").style.display = "none";

    document.getElementById("hud").style.display = "none";

    document.getElementById("menu").style.display = "flex";

}


// =========================
// MOVIMIENTO
// =========================

function moverJugador() {

    if (teclas["w"]) {

        jugador.y -= jugador.velocidad;

    }


    if (teclas["s"]) {

        jugador.y += jugador.velocidad;

    }


    if (teclas["a"]) {

        jugador.x -= jugador.velocidad;

    }


    if (teclas["d"]) {

        jugador.x += jugador.velocidad;

    }


    // Evitar salir de la pantalla

    jugador.x = Math.max(

        jugador.tamaño,

        Math.min(

            canvas.width - jugador.tamaño,

            jugador.x

        )

    );


    jugador.y = Math.max(

        jugador.tamaño,

        Math.min(

            canvas.height - jugador.tamaño,

            jugador.y

        )

    );

}


// =========================
// DISPARAR
// =========================

function disparar() {

    let dx = mouse.x - jugador.x;

    let dy = mouse.y - jugador.y;


    let distancia = Math.sqrt(

        dx * dx + dy * dy

    );


    if (distancia === 0) {

        return;

    }


    let velocidadBala = 10;


    balas.push({

        x: jugador.x,

        y: jugador.y,

        dx: (dx / distancia) * velocidadBala,

        dy: (dy / distancia) * velocidadBala,

        tamaño: 5

    });

}


// =========================
// CREAR ENEMIGO
// =========================

function crearEnemigo() {

    let lado = Math.floor(

        Math.random() * 4

    );


    let x;

    let y;


    // Izquierda

    if (lado === 0) {

        x = 0;

        y = Math.random() * canvas.height;

    }


    // Derecha

    if (lado === 1) {

        x = canvas.width;

        y = Math.random() * canvas.height;

    }


    // Arriba

    if (lado === 2) {

        x = Math.random() * canvas.width;

        y = 0;

    }


    // Abajo

    if (lado === 3) {

        x = Math.random() * canvas.width;

        y = canvas.height;

    }


    // Elegir enemigo

    let tipo = Math.random();


    // =========================
    // ENEMIGO NORMAL
    // =========================

    if (tipo < 0.60) {

        enemigos.push({

            x: x,

            y: y,

            tamaño: 20,

            velocidad: 1.5,

            vida: 1,

            puntos: 10,

            tipo: "normal"

        });

    }


    // =========================
    // ENEMIGO RÁPIDO
    // =========================

    else if (tipo < 0.85) {

        enemigos.push({

            x: x,

            y: y,

            tamaño: 15,

            velocidad: 3,

            vida: 1,

            puntos: 20,

            tipo: "rapido"

        });

    }


    // =========================
    // ENEMIGO GRANDE
    // =========================

    else {

        enemigos.push({

            x: x,

            y: y,

            tamaño: 35,

            velocidad: 0.8,

            vida: 3,

            puntos: 30,

            tipo: "grande"

        });

    }

}


// =========================
// ACTUALIZAR BALAS
// =========================

function actualizarBalas() {

    for (

        let i = balas.length - 1;

        i >= 0;

        i--

    ) {

        balas[i].x += balas[i].dx;

        balas[i].y += balas[i].dy;


        // Eliminar bala fuera de pantalla

        if (

            balas[i].x < 0 ||

            balas[i].x > canvas.width ||

            balas[i].y < 0 ||

            balas[i].y > canvas.height

        ) {

            balas.splice(i, 1);

        }

    }

}


// =========================
// ACTUALIZAR ENEMIGOS
// =========================

function actualizarEnemigos() {

    for (

        let i = enemigos.length - 1;

        i >= 0;

        i--

    ) {

        let enemigo = enemigos[i];


        let dx = jugador.x - enemigo.x;

        let dy = jugador.y - enemigo.y;


        let distancia = Math.sqrt(

            dx * dx + dy * dy

        );


        if (distancia > 0) {

            enemigo.x +=

                (dx / distancia) *

                enemigo.velocidad;


            enemigo.y +=

                (dy / distancia) *

                enemigo.velocidad;

        }


        // Daño al jugador

        if (

            distancia <

            jugador.tamaño +

            enemigo.tamaño

        ) {

            jugador.vida -= 1;


            document.getElementById(

                "vida"

            ).textContent = Math.max(

                0,

                jugador.vida

            );


            if (jugador.vida <= 0) {

                terminarJuego();

                return;

            }

        }

    }

}


// =========================
// COLISIONES
// =========================

function detectarColisiones() {

    for (

        let i = balas.length - 1;

        i >= 0;

        i--

    ) {

        for (

            let j = enemigos.length - 1;

            j >= 0;

            j--

        ) {

            let dx =

                balas[i].x -

                enemigos[j].x;


            let dy =

                balas[i].y -

                enemigos[j].y;


            let distancia = Math.sqrt(

                dx * dx + dy * dy

            );


            if (

                distancia <

                balas[i].tamaño +

                enemigos[j].tamaño

            ) {

                // La bala desaparece

                balas.splice(i, 1);


                // El enemigo pierde vida

                enemigos[j].vida--;


                // Si se queda sin vida

                if (enemigos[j].vida <= 0) {

                    puntos +=

                        enemigos[j].puntos;


                    document.getElementById(

                        "puntos"

                    ).textContent = puntos;


                    enemigos.splice(j, 1);

                }


                break;

            }

        }

    }

}


// =========================
// DIBUJAR
// =========================

function dibujar() {

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // Fondo

    ctx.fillStyle = "#202020";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // =========================
    // JUGADOR
    // =========================

    ctx.fillStyle = "#3498db";


    ctx.beginPath();


    ctx.arc(

        jugador.x,

        jugador.y,

        jugador.tamaño,

        0,

        Math.PI * 2

    );


    ctx.fill();


    // =========================
    // ARMA
    // =========================

    let dx =

        mouse.x -

        jugador.x;


    let dy =

        mouse.y -

        jugador.y;


    let distancia = Math.sqrt(

        dx * dx + dy * dy

    );


    if (distancia > 0) {

        ctx.strokeStyle = "white";

        ctx.lineWidth = 8;


        ctx.beginPath();


        ctx.moveTo(

            jugador.x,

            jugador.y

        );


        ctx.lineTo(

            jugador.x +

            (dx / distancia) * 40,

            jugador.y +

            (dy / distancia) * 40

        );


        ctx.stroke();

    }


    // =========================
    // BALAS
    // =========================

    ctx.fillStyle = "yellow";


    balas.forEach((bala) => {

        ctx.beginPath();


        ctx.arc(

            bala.x,

            bala.y,

            bala.tamaño,

            0,

            Math.PI * 2

        );


        ctx.fill();

    });


    // =========================
    // ENEMIGOS
    // =========================

    enemigos.forEach((enemigo) => {


        // 🔴 Normal

        if (enemigo.tipo === "normal") {

            ctx.fillStyle = "#e74c3c";

        }


        // 🟣 Rápido

        if (enemigo.tipo === "rapido") {

            ctx.fillStyle = "#9b59b6";

        }


        // 🟢 Grande

        if (enemigo.tipo === "grande") {

            ctx.fillStyle = "#2ecc71";

        }


        ctx.beginPath();


        ctx.arc(

            enemigo.x,

            enemigo.y,

            enemigo.tamaño,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // Barra de vida del grande

        if (

            enemigo.tipo === "grande"

        ) {

            let ancho = 50;


            let vidaActual =

                (enemigo.vida / 3) *

                ancho;


            ctx.fillStyle = "#555";


            ctx.fillRect(

                enemigo.x - ancho / 2,

                enemigo.y -

                    enemigo.tamaño -

                    12,

                ancho,

                5

            );


            ctx.fillStyle = "#ffffff";


            ctx.fillRect(

                enemigo.x - ancho / 2,

                enemigo.y -

                    enemigo.tamaño -

                    12,

                vidaActual,

                5

            );

        }

    });

}


// =========================
// BUCLE PRINCIPAL
// =========================

function juego() {

    if (!jugando) {

        return;

    }


    // Solo actualizar cuando
    // NO estamos en pausa

    if (!pausado) {

        moverJugador();

        actualizarBalas();

        actualizarEnemigos();

        detectarColisiones();

    }


    dibujar();


    requestAnimationFrame(juego);

}


// =========================
// GAME OVER
// =========================

function terminarJuego() {

    jugando = false;

    pausado = false;


    document.getElementById(

        "puntuacionFinal"

    ).textContent = puntos;


    document.getElementById(

        "gameOver"

    ).style.display = "flex";

}


// =========================
// CREAR ENEMIGOS
// =========================

setInterval(() => {

    if (jugando && !pausado) {

        crearEnemigo();

    }

}, 1200);


// =========================
// CAMBIAR TAMAÑO
// =========================

window.addEventListener(

    "resize",

    () => {

        canvas.width =

            window.innerWidth;

        canvas.height =

            window.innerHeight;

    }

);
