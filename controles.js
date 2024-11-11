var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var colors = ['izquierda', 'derecha', 'arriba', 'abajo', 'disparar'];

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
    var speechRecognitionList = new SpeechGrammarList();
    var grammar = '#JSGF V1.0; grammar controls; public <command> = ' + colors.join(' | ') + ' ;';
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
}

recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.body.onclick = function () {
    recognition.start();
    console.log('Listo para recibir un comando de voz.');
}

recognition.onresult = function pedoro (event) {
    var command = event.results[0][0].transcript.toLowerCase();
    console.log('Comando recibido: ' + command);
    
    switch (command) {
        case 'izquierda':
            nave.body.velocity.x = -200; // Mover a la izquierda
            break;
        case 'derecha':
            nave.body.velocity.x = 200; // Mover a la derecha
            break;
        case 'arriba':
            nave.body.velocity.y = -200; // Mover hacia arriba
            break;
        case 'abajo':
            nave.body.velocity.y = 200; // Mover hacia abajo
            break;
        case 'disparar':
            Juego.disparar(); // Llama a la función de disparar
            break;
        default:
            console.log("Comando no reconocido.");
    }
}

recognition.onspeechend = function () {
    recognition.stop();
}

recognition.onnomatch = function (event) {
    console.log("No se reconoció el comando.");
}

recognition.onerror = function (event) {
    console.log('Error en el reconocimiento: ' + event.error);
}
