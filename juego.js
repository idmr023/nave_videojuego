// Variables globales para gestionar los elementos principales del juego.
var nave;
var asteroides;
var timer;
var asteroidesEsquivados = 0;
var nivel = 1;
var velocidadAsteroides = 100;
var textoNivel;
var reconocimientoVoz; 
var nombreCreador = "Ivan Daniel Manrique Roa";
var movimientoEnCurso = 0; // Estado de movimiento: 0 = detenido, 1 = izquierda, 2 = derecha.

// Menú principal del juego.
var Menu = {
    preload: function () {
        // Carga los recursos necesarios para el menú (fondo y botón).
        juego.load.image('fondo', 'img/bg.png');
        juego.load.image('boton', 'img/boton.png');
    },

    create: function () {
        // Configura el fondo y ajusta su tamaño al de la pantalla.
        var fondo = juego.add.sprite(0, 0, 'fondo');
        fondo.width = juego.width;
        fondo.height = juego.height;

        // Añade el título del juego centrado en la pantalla.
        var titulo = juego.add.text(juego.width / 2, juego.height / 3, 'Juego de Asteroides', {
            font: '40px Arial',
            fill: '#ffffff'
        });
        titulo.anchor.setTo(0.5);

        // Crea un botón para iniciar el juego.
        var botonIniciar = juego.add.button(juego.width / 2, juego.height / 1.5, 'boton', function () {
            juego.state.start('Juego'); // Cambia al estado "Juego".
        });
        botonIniciar.anchor.setTo(0.5);

        // Añade un texto con el nombre del creador.
        juego.add.text(juego.width / 2, juego.height / 2.6, 'Creador: ' + nombreCreador, {
            font: '20px Arial',
            fill: '#ffffff'
        }).anchor.setTo(0.5);
    }
};

// Variables globales para gestionar los elementos principales del juego.
var Juego = {
    nave: null, // Referencia a la nave del jugador.
    asteroides: null, // Grupo de asteroides.
    timer: null, // Temporizador para generar asteroides periódicamente.
    asteroidesEsquivados: 0, // Contador de asteroides esquivados.
    nivel: 1, // Nivel actual del juego.
    velocidadAsteroides: 100, // Velocidad de los asteroides.
    textoNivel: null, // Texto para mostrar el nivel y los asteroides esquivados.
    reconocimientoVoz: null, // Variable para el reconocimiento de voz.
    movimientoEnCurso: 0, // Control de si el movimiento está en curso.
    nombreCreador: "Ivan Daniel Manrique Roa", // Nombre del creador del juego.

    // Lógica principal del juego.
    preload: function () {
        // Cargar los recursos para el juego (nave, asteroides, fondo, etc.).
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('asteroide', 'img/malo.png');
        juego.load.image('enemigo2', 'img/enemigos2.png');
        juego.load.image('bg', 'img/bg.png');
        juego.load.audio('musicaFondo', 'audio/fondo.mp3'); // Música de fondo.
        juego.load.audio('sonidoEsquivar', 'audio/esquivar.mp3'); // Sonido al esquivar asteroides.
    },

    create: function () {
        // Crear el fondo del juego y activar el sistema de física.
        juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg');
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // Crear y configurar la nave del jugador.
        Juego.nave = juego.add.sprite(juego.width / 2, juego.height - 100, 'nave');
        Juego.nave.anchor.setTo(0.5); // Establecer el centro de la nave.
        juego.physics.arcade.enable(Juego.nave); // Habilitar la física en la nave.
        Juego.nave.body.collideWorldBounds = true; // Habilitar la colisión con los límites del mundo.
        Juego.nave.body.setSize(50, 50, 0, 0); // Ajustar el tamaño de la nave para la colisión.

        // Crear asteroides.
        Juego.crearAsteroides();
        Juego.timer = juego.time.events.loop(2000, Juego.crearAsteroide, Juego); // Crear asteroides cada 2 segundos.

        // Mostrar el texto con el nivel y los asteroides esquivados.
        Juego.textoNivel = juego.add.text(10, 10, 'Nivel: 1\nAsteroides Esquivados: 0', {
            font: '20px Arial',
            fill: '#ffffff'
        });

        // Iniciar la música de fondo.
        Juego.musicaFondo = juego.add.audio('musicaFondo');
        Juego.musicaFondo.loop = true; // Reproducir música de fondo en bucle.
        Juego.musicaFondo.play();

        // Sonido al esquivar un asteroide.
        Juego.sonidoEsquivar = juego.add.audio('sonidoEsquivar');

        // Iniciar el reconocimiento de voz.
        Juego.iniciarReconocimientoVoz();
    },

    // Función para crear un grupo de asteroides.
    crearAsteroides: function () {
        Juego.asteroides = juego.add.group();
        Juego.asteroides.enableBody = true; // Habilitar la física para los asteroides.
        Juego.asteroides.createMultiple(50, 'asteroide'); // Crear 50 asteroides.
        Juego.asteroides.setAll('anchor.x', 0.5); // Centrar los asteroides.
        Juego.asteroides.setAll('anchor.y', 0.5);
        Juego.asteroides.setAll('checkWorldBounds', true); // Comprobar si los asteroides se salen del mundo.
        Juego.asteroides.setAll('outOfBoundsKill', true); // Destruir los asteroides que se salen del mundo.
    },

    // Función para crear un asteroide en una posición aleatoria.
    crearAsteroide: function () {
        var asteroide;
        if (Juego.nivel >= 2) {
            // En el nivel 2 y superior, generar enemigos tipo "enemigo2"
            asteroide = Juego.asteroides.getFirstDead(); // Obtener el primer asteroide muerto para reutilizarlo.
            asteroide.reset(Math.floor(Math.random() * (juego.width / 38)) * 38, 0); // Restablecer el asteroide en la posición generada.
            asteroide.loadTexture('enemigo2'); // Cambiar a la textura de enemigo2
        } else {
            // En el nivel 1, generar los asteroides tipo "malo.png"
            asteroide = Juego.asteroides.getFirstDead(); // Obtener el primer asteroide muerto para reutilizarlo.
            asteroide.reset(Math.floor(Math.random() * (juego.width / 38)) * 38, 0); // Restablecer el asteroide en la posición generada.
            asteroide.loadTexture('asteroide'); // Cambiar a la textura del asteroide normal
        }
        asteroide.anchor.setTo(0.5); // Centrar el asteroide.
        asteroide.body.velocity.y = Juego.velocidadAsteroides; // Asignar velocidad hacia abajo.
    },

    // Función para iniciar el reconocimiento de voz.
    iniciarReconocimientoVoz: function () {
        if (!('webkitSpeechRecognition' in window)) {
            console.error('El reconocimiento de voz no es compatible con este navegador.');
            return;
        }

        // Crear una instancia de SpeechRecognition.
        Juego.reconocimientoVoz = new webkitSpeechRecognition();
        Juego.reconocimientoVoz.continuous = true; // Continuar escuchando.
        Juego.reconocimientoVoz.interimResults = false; // No mostrar resultados intermedios.
        Juego.reconocimientoVoz.lang = 'es-ES'; // Establecer el idioma del reconocimiento a español.

        // Manejar el evento cuando se reconoce la voz.
        Juego.reconocimientoVoz.onresult = function (event) {
            var resultado = event.results[event.resultIndex]; // Obtener el resultado del reconocimiento.
            if (resultado.isFinal) { // Si es un resultado final.
                var comando = resultado[0].transcript.trim().toLowerCase(); // Obtener el comando como texto.
                console.log('Comando reconocido:', comando);
                Juego.controlarNave(comando); // Ejecutar el comando.
            }
        };

        // Manejar errores del reconocimiento de voz.
        Juego.reconocimientoVoz.onerror = function (event) {
            console.error('Error en el reconocimiento de voz: ', event.error);
        };

        // Iniciar el reconocimiento de voz.
        Juego.reconocimientoVoz.start();
    },

    // Función para controlar el movimiento de la nave según el comando de voz.
    controlarNave: function (comando) {
        const movimientos = {
            'izquierda': function () { Juego.nave.x -= 10; }, // Mover a la izquierda.
            'derecha': function () { Juego.nave.x += 10; }, // Mover a la derecha.
        };

        // Si el comando está en los movimientos, ejecutar la acción correspondiente.
        if (comandos[comando]) {
            movimientos[comando]();
        }
    },

    // Actualizar el estado del juego.
    update: function () {
        // Comprobar colisiones entre la nave y los asteroides.
        juego.physics.arcade.overlap(Juego.nave, Juego.asteroides, Juego.colisionAsteroide, null, this);

        // Comprobar si un asteroide ha llegado al fondo.
        Juego.asteroides.forEachAlive(function (asteroide) {
            if (asteroide.y > juego.height) {
                Juego.asteroidesEsquivados++;
                Juego.sonidoEsquivar.play();
            }
        });

        // Actualizar el texto de nivel y asteroides esquivados.
        Juego.textoNivel.text = 'Nivel: ' + Juego.nivel + '\nAsteroides Esquivados: ' + Juego.asteroidesEsquivados;
    },

    // Función para manejar la colisión entre la nave y los asteroides.
    colisionAsteroide: function (nave, asteroide) {
        // Fin del juego si la nave toca un asteroide.
        juego.state.start('Menu');
    }
};