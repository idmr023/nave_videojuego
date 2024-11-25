// Define los objetos para reconocimiento de voz, gramáticas y eventos de reconocimiento.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// Lista de comandos que se pueden reconocer.
var colors = ['izquierda', 'derecha'];

// Inicializa un objeto de reconocimiento de voz.
var recognition = new SpeechRecognition();

if (SpeechGrammarList) {
    // Crea una gramática basada en la lista de comandos y la añade al reconocimiento.
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar controls; public <command> = ' + colors.join(' | ') + ' ;';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList; // Asocia las gramáticas al reconocimiento.
}

// Configuración básica del objeto de reconocimiento de voz.
recognition.continuous = false; // El reconocimiento se detiene automáticamente después de cada resultado.
recognition.lang = 'es-ES'; // Idioma del reconocimiento (español de España).
recognition.interimResults = false; // No mostrar resultados provisionales.
recognition.maxAlternatives = 1; // Considerar solo la mejor alternativa de reconocimiento.

// Cuando se hace clic en el cuerpo del documento, se inicia el reconocimiento de voz.
document.body.onclick = function () {
    recognition.start();
    console.log('Listo para recibir un comando de voz.');
}

// Maneja los resultados del reconocimiento de voz.
recognition.onresult = function pedoro(event) {
    // Obtiene el comando reconocido, lo convierte a minúsculas y lo almacena.
    var command = event.results[0][0].transcript.toLowerCase();
    console.log('Comando recibido: ' + command);
    
    // Evalúa el comando reconocido y ejecuta la acción correspondiente.
    switch (command) {
        case 'izquierda':
            nave.body.velocity.x = -200; // Mueve la nave hacia la izquierda.
            break;
        case 'derecha':
            nave.body.velocity.x = 200; // Mueve la nave hacia la derecha.
            break;
        default:
            console.log("Comando no reconocido."); // Maneja comandos no válidos.
    }
}

// Detiene el reconocimiento cuando el usuario termina de hablar.
recognition.onspeechend = function () {
    recognition.stop();
}

// Notifica cuando no se reconoce ningún comando válido.
recognition.onnomatch = function (event) {
    console.log("No se reconoció el comando.");
}

// Maneja errores del reconocimiento de voz.
recognition.onerror = function (event) {
    console.log('Error en el reconocimiento: ' + event.error);
}
