// Variables globales para gestionar los elementos principales del juego.
var nave; // La nave controlada por el jugador.
var asteroides; // Grupo de asteroides generados en el juego.
var timer; // Temporizador para generar asteroides periódicamente.
var asteroidesEsquivados = 0; // Contador de asteroides esquivados.
var nivel = 1; // Nivel actual del juego.
var velocidadAsteroides = 100; // Velocidad inicial de los asteroides.
var textoNivel; // Texto para mostrar el nivel y los asteroides esquivados.
var reconocimientoVoz; // Objeto para el reconocimiento de voz.
var nombreCreador = "Ivan Daniel Manrique Roa"; // Nombre del creador del juego.
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
        // Carga los recursos del juego (nave, asteroides y fondo).
        juego.load.image('nave', 'img/nave.png');
        juego.load.image('asteroide', 'img/malo.png');
        juego.load.image('bg', 'img/bg.png');
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
        nave.body.collideWorldBounds = true; // Evita que la nave salga de los límites del juego.
        nave.body.setSize(50, 50, 0, 0); // Ajusta el área de colisión de la nave.

        // Configura el grupo de asteroides y un temporizador para generarlos periódicamente.
        this.crearAsteroides();
        timer = juego.time.events.loop(2000, this.crearAsteroide, this);

        // Añade el texto que muestra el nivel y los asteroides esquivados.
        textoNivel = juego.add.text(10, 10, 'Nivel: 1\nAsteroides Esquivados: 0', {
            font: '20px Arial',
            fill: '#ffffff'
        });

        // Inicia el reconocimiento de voz.
        this.iniciarReconocimientoVoz();
    },

    iniciarReconocimientoVoz: function () {
        // Configura el reconocimiento de voz para interpretar comandos en español.
        reconocimientoVoz = new webkitSpeechRecognition();
        reconocimientoVoz.continuous = true; // Mantiene el reconocimiento activo continuamente.
        reconocimientoVoz.interimResults = false; // Solo considera resultados finales.
        reconocimientoVoz.lang = 'es-ES'; // Configura el idioma a español.

        // Maneja los resultados del reconocimiento de voz.
        reconocimientoVoz.onresult = function (event) {
            var resultado = event.results[event.resultIndex];
            if (resultado.isFinal) {
                var comando = resultado[0].transcript.trim().toLowerCase();
                console.log('Comando reconocido:', comando);
                Juego.controlarNave(comando); // Ejecuta el comando.
            }
        };

        // Maneja errores del reconocimiento de voz.
        reconocimientoVoz.onerror = function (event) {
            console.error('Error en el reconocimiento de voz: ', event.error);
        };

        reconocimientoVoz.start(); // Inicia el reconocimiento de voz.
    },

    controlarNave: function (comando) {
        // Controla el movimiento de la nave según el comando recibido.
        comando = comando.trim().toLowerCase();
        switch (comando) {
            case 'izquierda.':
                this.moverNave(-1); // Mueve la nave a la izquierda.
                break;
            case 'derecha.':
                this.moverNave(1); // Mueve la nave a la derecha.
                break;
            default:
                console.log('Comando no reconocido:', comando);
        }
    },

    moverNave: function (direccion) {
        // Ajusta la aceleración y velocidad de la nave según la dirección.
        const VELOCIDAD_MAXIMA = 200;
        const ACELERACION = 150;

        nave.body.acceleration.x = direccion * ACELERACION;
        nave.body.velocity.x = Phaser.Math.clamp(nave.body.velocity.x, -VELOCIDAD_MAXIMA, VELOCIDAD_MAXIMA);
    },

    crearAsteroides: function () {
        // Configura el grupo de asteroides para que puedan ser reutilizados.
        asteroides = juego.add.group();
        asteroides.enableBody = true;
        asteroides.createMultiple(50, 'asteroide');
        asteroides.setAll('anchor.x', 0.5);
        asteroides.setAll('anchor.y', 0.5);
        asteroides.setAll('checkWorldBounds', true); // Detecta si están fuera de los límites del juego.
        asteroides.setAll('outOfBoundsKill', true); // Elimina los asteroides fuera de los límites.
    },

    crearAsteroide: function () {
        // Genera un nuevo asteroide en una posición aleatoria en la parte superior.
        var asteroide = asteroides.getFirstDead();
        var num = Math.floor(Math.random() * (juego.width / 38));
        asteroide.reset(num * 38, 0);
        asteroide.anchor.setTo(0.5);
        asteroide.body.velocity.y = velocidadAsteroides; // Ajusta su velocidad de caída.
    },

    update: function () {
        // Verifica colisiones entre la nave y los asteroides.
        juego.physics.arcade.overlap(nave, asteroides, this.gameOver, null, this);

        // Revisa si los asteroides han salido de los límites del juego.
        asteroides.forEachAlive(function (asteroide) {
            if (asteroide.y > juego.height) {
                asteroide.kill(); // Elimina el asteroide.
                asteroidesEsquivados++; // Incrementa el contador de asteroides esquivados.
                textoNivel.setText('Nivel: ' + nivel + '\nAsteroides Esquivados: ' + asteroidesEsquivados);

                // Incrementa el nivel y la velocidad cada 5 asteroides esquivados.
                if (asteroidesEsquivados % 5 === 0) {
                    nivel++;
                    velocidadAsteroides += 50;
                    textoNivel.setText('Nivel: ' + nivel + '\nAsteroides Esquivados: ' + asteroidesEsquivados);
                }
            }
        }, this);
    },

    gameOver: function () {
        // Finaliza el juego y regresa al menú.
        alert("Juego terminado");
        juego.state.start('Menu');
    },
};
