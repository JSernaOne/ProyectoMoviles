let map;
let marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 4.299459, lng: -75.290729 },
        zoom: 6
    });

    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });
}

function placeMarker(location) {
    if (!marker) {
        marker = new google.maps.Marker({
            position: location,
            map: map
        });
    } else {
        marker.setPosition(location);
    }

    // Store the selected location in hidden inputs
    document.getElementById('task-latitude').value = location.lat();
    document.getElementById('task-longitude').value = location.lng();
}

function closeAddTaskPage() {
    window.location = '/template/home.html';
}

function saveTask() {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskImportance = document.querySelector('input[name="importance"]:checked')?.value;
    const taskLatitude = document.getElementById('task-latitude').value;
    const taskLongitude = document.getElementById('task-longitude').value;

    if (taskName && taskDate && taskTime && taskImportance && taskLatitude && taskLongitude) {
        const task = {
            text: taskName,
            date: taskDate,
            time: taskTime,
            location: {
                latitude: taskLatitude,
                longitude: taskLongitude
            },
            priority: taskImportance
        };

        // Save task to localStorage or any other storage
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Return to home page
        closeAddTaskPage();
    } else {
        ons.notification.alert('Por favor, completa todos los campos.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
