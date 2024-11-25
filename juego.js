// Variables globales para gestionar los elementos principales del juego.
var nave;
var asteroides;
var timer;
var velocidadAsteroides = 100; // Aumenta o disminuye esta velocidad según el nivel
var nivel = 1; // El nivel inicial del juego
var asteroidesEsquivados = 0; // Contador de asteroides esquivados
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

    // Menú principal del juego.
    Menu: {
        preload: function () {
            // Cargar imágenes para el menú.
            juego.load.image('fondo', 'img/bg.png');
            juego.load.image('boton', 'img/boton.png');
        },

        create: function () {
            // Crear el fondo de la pantalla.
            var fondo = juego.add.sprite(0, 0, 'fondo');
            fondo.width = juego.width; // Ajustar el fondo al tamaño de la pantalla.
            fondo.height = juego.height;

            // Título del juego centrado.
            var titulo = juego.add.text(juego.width / 2, juego.height / 3, 'Juego de Asteroides', {
                font: '40px Arial',
                fill: '#ffffff'
            });
            titulo.anchor.setTo(0.5);

            // Botón para iniciar el juego.
            var botonIniciar = juego.add.button(juego.width / 2, juego.height / 1.5, 'boton', function () {
                juego.state.start('Juego'); // Cambiar al estado de "Juego" cuando se presiona el botón.
            });
            botonIniciar.anchor.setTo(0.5);

            // Texto con el nombre del creador.
            juego.add.text(juego.width / 2, juego.height / 2.6, 'Creador: ' + Juego.nombreCreador, {
                font: '20px Arial',
                fill: '#ffffff'
            }).anchor.setTo(0.5);
        }
    },

    // Lógica principal del juego.
    preload: function () {
        // Cargar los recursos para el juego.
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

    reiniciarJuego: function () {
        // Restablecer variables globales.
        Juego.nivel = 1;
        Juego.asteroidesEsquivados = 0;
        Juego.velocidadAsteroides = 100;
        Juego.movimientoEnCurso = 0;
        Juego.nave.x = juego.width / 2; // Volver a la posición inicial.
        Juego.nave.y = juego.height - 100;
    
        // Restablecer asteroides.
        Juego.asteroides.callAll('kill'); // Destruir todos los asteroides.
    
        // Restablecer texto del nivel y asteroides esquivados.
        Juego.actualizarTextoNivel();
    
        // Reiniciar música y sonidos.
        Juego.musicaFondo.stop();
        Juego.musicaFondo.play();
    
        // Reiniciar el temporizador para los asteroides.
        Juego.timer.remove();
        Juego.timer = juego.time.events.loop(2000, Juego.crearAsteroide, Juego); // Iniciar nuevo ciclo de creación de asteroides.
    
        // Reiniciar el reconocimiento de voz.
        Juego.reconocimientoVoz.stop(); // Detener reconocimiento de voz.
        Juego.iniciarReconocimientoVoz(); // Reiniciar el reconocimiento de voz.
    
        // Iniciar el estado de juego de nuevo.
        juego.state.start('Juego');
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
        var asteroide = Juego.asteroides.getFirstDead(); // Obtener un asteroide muerto (no visible).
        if (asteroide) {
            var x = juego.rnd.integerInRange(50, juego.width - 50); // Posición aleatoria en X.
            var y = -50; // Fuera de la pantalla en la parte superior.
            asteroide.reset(x, y); // Colocar el asteroide en la pantalla.
            asteroide.body.velocity.y = Juego.velocidadAsteroides; // Asignar velocidad hacia abajo.
        }
    },

    // Función para actualizar el texto de nivel y asteroides esquivados.
    actualizarTextoNivel: function () {
        Juego.textoNivel.text = 'Nivel: ' + Juego.nivel + '\nAsteroides Esquivados: ' + Juego.asteroidesEsquivados;
    },

    // Función para gestionar el movimiento de la nave.
    controlarNave: function (comando) {
        comando = comando.trim().toLowerCase();
        switch (comando) {
            case 'izquierda.':
                Juego.moverNave(-1); // Mueve la nave a la izquierda.
                break;
            case 'derecha.':
                Juego.moverNave(1); // Mueve la nave a la derecha.
                break;
            default:
                console.log('Comando no reconocido:', comando);
        }
    },

    moverNave: function (direccion) {
        // Ajusta la aceleración y velocidad de la nave según la dirección.
        const VELOCIDAD_MAXIMA = 200;
        const ACELERACION = 150;

        Juego.nave.body.acceleration.x = direccion * ACELERACION;
        Juego.nave.body.velocity.x = Phaser.Math.clamp(Juego.nave.body.velocity.x, -VELOCIDAD_MAXIMA, VELOCIDAD_MAXIMA);
    },

    // Función para iniciar el reconocimiento de voz.
    iniciarReconocimientoVoz: function () {
        if ('webkitSpeechRecognition' in window) {
            Juego.reconocimientoVoz = new webkitSpeechRecognition();
            Juego.reconocimientoVoz.continuous = true; // Escuchar continuamente.
            Juego.reconocimientoVoz.interimResults = false; // Solo mostrar resultados finales.

            Juego.reconocimientoVoz.onresult = function (event) {
                var resultado = event.results[event.resultIndex];
                if (resultado.isFinal) {
                    var comando = resultado[0].transcript.trim().toLowerCase();
                    console.log('Comando reconocido:', comando); // Imprimir el comando reconocido.
                    Juego.controlarNave(comando);
                }
            };

            Juego.reconocimientoVoz.start(); // Iniciar el reconocimiento de voz.
        } else {
            alert('El reconocimiento de voz no es compatible con tu navegador.');
        }
    }
};