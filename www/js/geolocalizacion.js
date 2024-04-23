function obtenerGeolocalizacion() {
    console.log('obtenerGeolocalizacion');
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
}

function onSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var altitude = position.coords.altitude;
    var accuracy = position.coords.accuracy;
    var altitudeAccuracy = position.coords.altitudeAccuracy;
    var heading = position.coords.heading;
    var speed = position.coords.speed;
    var timestamp = position.timestamp;

    // Llama a una función para mostrar la información en la tabla
    mostrarInformacionGeolocalizacion(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp);
}

function onError(error) {
    console.error('Error al obtener la geolocalización:', error);
}

function mostrarInformacionGeolocalizacion(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp) {
    var fila = "<tr><td>" + latitude + "</td><td>" + longitude + "</td><td>" + altitude + "</td><td>" + accuracy + "</td><td>" + altitudeAccuracy + "</td><td>" + heading + "</td><td>" + speed + "</td><td>" + timestamp + "</td></tr>";
    var btn = document.createElement("TR");
    btn.innerHTML = fila;
    document.getElementById("tabla").appendChild(btn);
}

function agregarEventListeners() {
    document.getElementById('push-tabla').addEventListener('click', function() {
        obtenerGeolocalizacion();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    agregarEventListeners(); // Llama a esta función cuando el DOM esté completamente cargado
});
