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

// Lógica principal del juego.
var Juego = {
    preload: function () {
        // Carga los recursos del juego (nave, asteroides, fondo y sonidos).
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('asteroide', 'img/malo.png');
        juego.load.image('bg', 'img/bg.png');
        juego.load.audio('musicaFondo', 'audio/fondo.mp3'); // Sonido de fondo.
        juego.load.audio('sonidoEsquivar', 'audio/esquivar.mp3'); // Sonido al esquivar.
    },

    create: function () {
        // Configura el fondo del juego y ajusta su tamaño a la pantalla.
        juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg');

        // Inicia el sistema de física.
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // Crea y configura la nave del jugador.
        nave = juego.add.sprite(juego.width / 2, juego.height - 100, 'nave');
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave);
        nave.body.collideWorldBounds = true;
        nave.body.setSize(50, 50, 0, 0);

        // Configura el grupo de asteroides y un temporizador para generarlos periódicamente.
        this.crearAsteroides();
        timer = juego.time.events.loop(2000, this.crearAsteroide, this);

        // Añade el texto que muestra el nivel y los asteroides esquivados.
        textoNivel = juego.add.text(10, 10, 'Nivel: 1\nAsteroides Esquivados: 0', {
            font: '20px Arial',
            fill: '#ffffff'
        });

        // Carga y reproduce la música de fondo en bucle.
        this.musicaFondo = juego.add.audio('musicaFondo');
        this.musicaFondo.loop = true; // Reproducción en bucle.
        this.musicaFondo.play();

        // Carga el sonido de esquivar para usarlo después.
        this.sonidoEsquivar = juego.add.audio('sonidoEsquivar');

        // Inicia el reconocimiento de voz.
        Juego.iniciarReconocimientoVoz();
    },

    crearAsteroides: function () {
        asteroides = juego.add.group();
        asteroides.enableBody = true;
        asteroides.createMultiple(50, 'asteroide');
        asteroides.setAll('anchor.x', 0.5);
        asteroides.setAll('anchor.y', 0.5);
        asteroides.setAll('checkWorldBounds', true);
        asteroides.setAll('outOfBoundsKill', true);
    },

    crearAsteroide: function () {
        var asteroide = asteroides.getFirstDead();
        var num = Math.floor(Math.random() * (juego.width / 38));
        asteroide.reset(num * 38, 0);
        asteroide.anchor.setTo(0.5);
        asteroide.body.velocity.y = velocidadAsteroides;
    },

    update: function () {
        juego.physics.arcade.overlap(nave, asteroides, this.gameOver, null, this);

        asteroides.forEachAlive(function (asteroide) {
            if (asteroide.y > juego.height) {
                asteroide.kill(); // Elimina el asteroide.
                asteroidesEsquivados++; // Incrementa el contador de asteroides esquivados.

                // Reproduce el sonido al esquivar.
                this.sonidoEsquivar.play();

                textoNivel.setText('Nivel: ' + nivel + '\nAsteroides Esquivados: ' + asteroidesEsquivados);

                if (asteroidesEsquivados % 5 === 0) {
                    nivel++;
                    velocidadAsteroides += 50;
                    textoNivel.setText('Nivel: ' + nivel + '\nAsteroides Esquivados: ' + asteroidesEsquivados);
                }
            }
        }, this);
    },

    gameOver: function () {
        alert("Juego terminado");
        this.musicaFondo.stop(); // Detiene la música de fondo.
        juego.state.start('Menu');
    },
};