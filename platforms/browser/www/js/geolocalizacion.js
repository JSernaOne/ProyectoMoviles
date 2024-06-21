let map;
let marker;
let taskMarkers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 4.299459, lng: -75.290729 },
        zoom: 6
    });

    // Forzar la carga del mapa al cargar la página
    window.addEventListener('load', initMap);
    loadTaskMarkers(); // Cargar los marcadores de las tareas almacenadas
}

function closeMap() {
    window.location = "/template/home.html";
}

function todos() {
    obtenerGeolocalizacion();
    vibrar();
}

function obtenerGeolocalizacion() {
    console.log('obtenerGeolocalizacion');
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
}

function onSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    // Muestra la localización en el mapa
    mostrarEnMapa(latitude, longitude);
}

function onError(error) {
    console.error('Error al obtener la geolocalización:', error);
}

function mostrarEnMapa(latitude, longitude) {
    const myLatLng = { lat: latitude, lng: longitude };

    if (!marker) {
        marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: "Ubicación Actual"
        });
        const infoWindow = new google.maps.InfoWindow({
            content: '<div class="custom-info-window"><h1>Ubicación Actual</h1><p>Esta es tu ubicación actual.</p></div>'
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

    } else {
        marker.setPosition(myLatLng);
    }

    map.setCenter(myLatLng);
    map.setZoom(15); // Acerca el mapa a un nivel de zoom más cercano
}

function loadTaskMarkers() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        if (task && task.latitude && task.longitude) {
            let taskLatLng = { lat: parseFloat(task.latitude), lng: parseFloat(task.longitude) };

            let taskMarker = new google.maps.Marker({
                position: taskLatLng,
                map: map,
                title: task.lista
            });
            const infoWindow = new google.maps.InfoWindow({
                content: `<div class="custom-info-window"><h1>${task.lista}</h1><p>Esta es la ubicación de tu tarea.</p></div>`
                });

            taskMarker.addListener('click', () => {
                infoWindow.open(map, taskMarker);
                });

            taskMarkers.push(taskMarker);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initMap();
});

