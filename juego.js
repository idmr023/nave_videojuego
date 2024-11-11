var nave;
var asteroides;
var timer;
var asteroidesEsquivados = 0;
var nivel = 1;
var velocidadAsteroides = 100;
var textoNivel;
var reconocimientoVoz;
var nombreCreador = "Ivan Daniel Manrique Roa";
var movimientoEnCurso = 0; // 0: detenido, 1: moviéndose a la izquierda, 2: moviéndose a la derecha

var Menu = {
    preload: function () {
        juego.load.image('fondo', 'img/bg.png');
        juego.load.image('boton', 'img/boton.png');
    },

    create: function () {
        var fondo = juego.add.sprite(0, 0, 'fondo');
        fondo.width = juego.width;
        fondo.height = juego.height;

        var titulo = juego.add.text(juego.width / 2, juego.height / 3, 'Juego de Asteroides', {
            font: '40px Arial',
            fill: '#ffffff'
        });
        titulo.anchor.setTo(0.5);

        var botonIniciar = juego.add.button(juego.width / 2, juego.height / 1.5, 'boton', function () {
            juego.state.start('Juego');
        });
        botonIniciar.anchor.setTo(0.5);

        juego.add.text(juego.width / 2, juego.height / 2.6, 'Creador: ' + nombreCreador, {
            font: '20px Arial',
            fill: '#ffffff'
        }).anchor.setTo(0.5);        
    }
};

var Juego = {
    preload: function () {
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('asteroide', 'img/malo.png');
        juego.load.image('bg', 'img/bg.png');
    },

    create: function () {
        // Ajusta el fondo al tamaño del juego
        juego.add.tileSprite(0, 0, juego.width, juego.height, 'bg');

        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // La nave se coloca en el centro, pero usando el tamaño dinámico
        nave = juego.add.sprite(juego.width / 2, juego.height - 100, 'nave'); // Ajuste vertical al fondo
        nave.anchor.setTo(0.5);
        juego.physics.arcade.enable(nave);
        nave.body.collideWorldBounds = true;

        nave.body.setSize(50, 50, 0, 0); // Ajusta el área de colisión

        this.crearAsteroides();
        timer = juego.time.events.loop(2000, this.crearAsteroide, this);

        // Texto del nivel y asteroides esquivados, ajustado al tamaño de la pantalla
        textoNivel = juego.add.text(10, 10, 'Nivel: 1\nAsteroides Esquivados: 0', { font: '20px Arial', fill: '#ffffff' });

        this.iniciarReconocimientoVoz();
    },

    iniciarReconocimientoVoz: function () {
        reconocimientoVoz = new webkitSpeechRecognition();
        reconocimientoVoz.continuous = true;
        reconocimientoVoz.interimResults = false;
        reconocimientoVoz.lang = 'es-ES';

        reconocimientoVoz.onresult = function (event) {
            var resultado = event.results[event.resultIndex];
            if (resultado.isFinal) {
                var comando = resultado[0].transcript.trim().toLowerCase();
                console.log('Comando reconocido:', comando);
                Juego.controlarNave(comando);
            }
        };

        reconocimientoVoz.onerror = function (event) {
            console.error('Error en el reconocimiento de voz: ', event.error);
        };

        reconocimientoVoz.start();
    },

    controlarNave: function (comando) {
        comando = comando.trim().toLowerCase();
        switch (comando) {
            case 'izquierda.':
                this.moverNave(-1);
                break;
            case 'derecha.':
                this.moverNave(1);
                break;
            default:
                console.log('Comando no reconocido:', comando);
        }
    },

    moverNave: function (direccion) {
        const VELOCIDAD_MAXIMA = 200;
        const ACELERACION = 150;

        nave.body.acceleration.x = direccion * ACELERACION;
        nave.body.velocity.x = Phaser.Math.clamp(nave.body.velocity.x, -VELOCIDAD_MAXIMA, VELOCIDAD_MAXIMA);
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
                asteroide.kill();
                asteroidesEsquivados++;
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
        juego.state.start('Menu');
    },
};

