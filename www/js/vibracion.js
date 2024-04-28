function vibrar() {
    console.log('Vibrando');
    navigator.vibrate(300); // Vibra durante 3 segundos
}

function agregarEventListenerVibracion() {
    document.getElementById('push-tabla').addEventListener('click', function() {
        vibrar();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    agregarEventListenerVibracion(); // Llama a esta función cuando el DOM esté completamente cargado
});
