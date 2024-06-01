let map;
let marker;

const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 4.299459, lng: -75.290729 },
        zoom: 6
    });

    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
}

const placeMarker = (location) =>{
    if (!marker) {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    } else {
        marker.setPosition(location);
    }

    // mostrar latitud y longitud en los campos de texto
    document.getElementById('task-latitude').value = location.lat();
    document.getElementById('task-longitude').value = location.lng();
}

function closeAddTaskPage() {
    window.location = '/template/home.html';
}

const saveTask = async () =>{
    const taskName = document.getElementById('task-name').value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskImportance = document.querySelector('input[name="importance"]:checked')?.value;
    const taskLatitude = document.getElementById('task-latitude').value;
    const taskLongitude = document.getElementById('task-longitude').value;

    if (taskName && taskDate && taskTime && taskImportance && taskLatitude && taskLongitude) {
        const geolocalizacion = {
            latitude: taskLatitude,
            longitude: taskLongitude
        };

        // Save task to localStorage or any other storage
        saveGeolocalizacion(geolocalizacion);

        db.transaction(function(tx) {
            tx.executeSql(
                `INSERT INTO Tareas (lista, fecha, hora, priority, idGeo, iduser) VALUES (?, ?, ?, ?, ?, ?)`,
                [task.text, task.date, task.time, task.priority, getGeolocalizacionId(geolocalizacion), getUserId()],
                function(tx, res) {
                    console.log('Tarea guardada exitosamente.');
                },
                function(tx, error) {
                    console.error('Error al guardar la tarea: ' + error.message);
                }
            );
        });

        // Return to home page
        closeAddTaskPage();
    } else {
        ons.notification.alert('Por favor, completa todos los campos.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
