// Función que obtiene los registros de la BD local y los retorna al servidor
const syncLocalToServer = async () => {
  try {
    const localData = await fetchUnsyncedData();
    const response = await fetch(
      "http://localhost:3050/api/sync/syncFromLocal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(localData),
      }
    );

    if (response.status === 200) {
      console.log("Datos sincronizados exitosamente al servidor.");
      await markDataAsSynced(localData); // Marcar datos como sincronizados en la base de datos local
    } else {
      console.error(
        "Falló la sincronización al servidor:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Falló la sincronización al servidor:", error.message);
  }
};

const markDataAsSynced = async (localData) => {
  db.transaction((tx) => {
    localData.users.forEach((user) => {
      tx.executeSql("UPDATE User SET sync_status = 1 WHERE id = ?", [user.id]);
    });
    localData.geolocalizacion.forEach((geo) => {
      tx.executeSql("UPDATE Geolocalizacion SET sync_status = 1 WHERE id = ?", [
        geo.id,
      ]);
    });
    localData.tareas.forEach((task) => {
      tx.executeSql("UPDATE Tareas SET sync_status = 1 WHERE id = ?", [
        task.id,
      ]);
    });
  });
};

const fetchUnsyncedData = async () => {
  return new Promise((resolve, reject) => {
    let userslist = [];
    let geolocalizacionList = [];
    let tareasList = [];

    const fetchUsers = () => {
      return new Promise((res, rej) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM User WHERE sync_status = 0",
            [],
            (tx, results) => {
              for (let i = 0; i < results.rows.length; i++) {
                userslist.push(results.rows.item(i));
              }
              res();
            },
            (error) => {
              console.error("Error fetching users:", error.message);
              rej(error);
            }
          );
        });
      });
    };

    const fetchGeolocalizacion = () => {
      return new Promise((res, rej) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM Geolocalizacion WHERE sync_status = 0",
            [],
            (tx, results) => {
              for (let i = 0; i < results.rows.length; i++) {
                geolocalizacionList.push(results.rows.item(i));
              }
              res();
            },
            (error) => {
              console.error("Error fetching geolocalizacion:", error.message);
              rej(error);
            }
          );
        });
      });
    };

    const fetchTareas = () => {
      return new Promise((res, rej) => {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM Tareas WHERE sync_status = 0",
            [],
            (tx, results) => {
              for (let i = 0; i < results.rows.length; i++) {
                tareasList.push(results.rows.item(i));
              }
              res();
            },
            (error) => {
              console.error("Error fetching tareas:", error.message);
              rej(error);
            }
          );
        });
      });
    };

    Promise.all([fetchUsers(), fetchGeolocalizacion(), fetchTareas()])
      .then(() => {
        resolve({
          users: userslist,
          geolocalizacion: geolocalizacionList,
          tareas: tareasList,
        });
      })
      .catch(reject);
  });
};

// Función para descargar datos actualizados del servidor
const syncFromServer = async () => {
  try {
    const response = await fetch("http://localhost:3050/api/sync/syncToLocal", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const serverData = await response.json(); // Convertir la respuesta a JSON
      updateLocalDatabase(serverData);
    } else {
      console.error("Failed to fetch data from server:", response.statusText);
    }
  } catch (error) {
    console.error("Failed to fetch data from server:", error.message);
  }
};

const updateLocalDatabase = async (serverData) => {
  const { user } = serverData;
  const { geolocalizacion } = serverData;
  const { tareas } = serverData;
  db.transaction(function (tx) {
    user.forEach((u) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO User (id, name, email, username, password, salt, phone, status, show_quote, last_login, sync_status, last_sync) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          u.id,
          u.name,
          u.email,
          u.username,
          u.password,
          u.salt,
          u.phone,
          u.status,
          u.show_quote,
          u.last_login,
          u.sync_status,
          u.last_sync,
        ]
      );
    });
  });

  db.transaction(function (tx) {
    geolocalizacion.forEach((geo) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO Geolocalizacion (id, latitude, longitude, sync_status, last_sync) VALUES (?, ?, ?, ?, ?)",
        [geo.id, geo.latitud, geo.longitud, geo.sync_status, geo.last_sync]
      );
    });
  });

  db.transaction(function (tx) {
    tareas.forEach((task) => {
      tx.executeSql(
        "INSERT OR REPLACE INTO Tareas (id, lista, fecha, hora, priority, idGeo, iduser, sync_status, last_sync, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          task.id,
          task.lista,
          task.fecha,
          task.hora,
          task.priority,
          task.idGeo,
          task.iduser,
          task.sync_status,
          task.last_sync,
          task.estado,
        ]
      );
    });
  });
};
