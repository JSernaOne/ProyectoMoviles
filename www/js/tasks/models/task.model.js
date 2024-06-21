let map;
let marker;

const initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 4.299459, lng: -75.290729 },
    zoom: 6,
  });

  // Forzar la carga del mapa al cargar la página
  window.addEventListener('load', initMap);
  map.addListener("click", function (event) {
    placeMarker(event.latLng);
  });
};

const placeMarker = (location) => {
  if (!marker) {
    marker = new google.maps.Marker({
      position: location,
      map: map,
    });
  } else {
    marker.setPosition(location);
  }

  // Mostrar latitud y longitud en los campos de texto
  document.getElementById("task-latitude").value = location.lat();
  document.getElementById("task-longitude").value = location.lng();
};

function closeAddTaskPage() {
  window.location = "/template/home.html";
}

async function saveTasks() {
  const task = document.getElementById("task-name").value.trim();
  const taskDate = document.getElementById("task-date").value;
  const taskTime = document.getElementById("task-time").value;
  const taskImportance = document.querySelector(
    'input[name="importance"]:checked'
  )?.value;
  const taskLatitude = document.getElementById("task-latitude").value;
  const taskLongitude = document.getElementById("task-longitude").value;

  if (!task || !taskDate || !taskTime || !taskImportance) {
    ons.notification.alert("Todos los campos son obligatorios");
    return;
  }

  const geolocalizacion = {
    latitude: parseFloat(taskLatitude),
    longitude: parseFloat(taskLongitude),
  };

  try {
    await saveGeolocalizacion(geolocalizacion);
    const geolocalizacionId = await getGeolocalizacionId(geolocalizacion);
    const userId = await getConcurrentUser(); // Asegúrate de esperar la promesa

    db.transaction(function (tx) {
      tx.executeSql(
        "INSERT INTO Tareas (lista, fecha, hora, priority, idGeo, iduser) VALUES (?, ?, ?, ?, ?, ?)",
        [task, taskDate, taskTime, taskImportance, geolocalizacionId, userId],
        function (tx, res) {
          saveTasksCloude({
            lista: task,
            fecha: taskDate,
            hora: taskTime,
            priority: taskImportance,
            idGeo: geolocalizacionId,
            iduser: userId,
          });
          closeAddTaskPage();
        },
        function (tx, error) {
          console.error("Error al guardar la tarea: " + error.message);
        }
      );
    });
  } catch (error) {
    ons.notification.alert("Error al guardar la tarea");
    console.error(error);
  }
}

const getTasksFromDB = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        `SELECT Tareas.id, Tareas.lista, Tareas.fecha, Tareas.hora, Tareas.priority, 
        Geolocalizacion.latitude, Geolocalizacion.longitude 
        FROM Tareas 
        INNER JOIN Geolocalizacion ON Tareas.idGeo = Geolocalizacion.id
        WHERE Tareas.estado = 1 AND Tareas.iduser = ?`,
        [userId],
        function (tx, res) {
          try {
            const tasks = [];
            for (let i = 0; i < res.rows.length; i++) {
              const task = res.rows.item(i);
              tasks.push(task);
            }
            localStorage.setItem("tasks", JSON.stringify(tasks));
            resolve(tasks);
          } catch (error) {
            console.error("Error processing tasks: " + error.message);
            reject(error);
          }
        },
        function (tx, error) {
          console.error("Error al obtener las tareas: " + error.message);
          reject(error);
        }
      );
    });
  });
};

const removeTask = (taskId, taskItem) => {
  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE Tareas SET estado = 0 WHERE id = ?",
      [taskId],
      function (tx, res) {
        taskItem.remove();
        removeTaskFromCloud(taskId);
        displayTasks();
        ons.notification.alert("Tarea eliminada exitosamente");
      },
      function (tx, error) {
        console.error("Error al eliminar la tarea: " + error.message);
      }
    );
  });
};

document.addEventListener("DOMContentLoaded", (event) => {
  checkAuth();


  initMap();
  const button = document.getElementById("save-tasks-button");
  button.addEventListener("click", async () => {
    await saveTasks();
  });
});
