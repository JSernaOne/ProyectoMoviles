const saveUser = async (user) => {
  try {
    const checkUser = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM User WHERE username = ? OR email = ? OR phone = ?",
          [user.username, user.email, user.phone],
          (tx, res) => {
            if (res.rows.length > 0) {
              return resolve(true); // Usuario ya existe
            }
            resolve(false); // Usuario no existe
          },
          (tx, error) => {
            reject(new Error("Error verificando usuario: " + error.message));
          }
        );
      });
    });

    if (checkUser) {
      return ons.notification.alert(
        "El username, email o teléfono ya están registrados."
      );
    }

    await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO User (name, email, username, password, salt, phone) VALUES (?, ?, ?, ?, ?, ?)",
          [
            user.name,
            user.email,
            user.username,
            user.password,
            user.salt,
            user.phone,
          ],
          (tx, res) => {
            console.log("Usuario registrado exitosamente.");
            registerUserCloud(user);
            resolve();
          },
          (tx, error) => {
            reject(new Error("Error registrando usuario: " + error.message));
          }
        );
      });
    });
  } catch (error) {
    ons.notification.alert(error.message);
  }
};

// Función para actualizar el usuario en la base de datos local
const updateUser = async (user) => {
  try {
      await new Promise((resolve, reject) => {
          db.transaction((tx) => {
              // Verificar si el usuario existe
              tx.executeSql(
                  "SELECT * FROM User WHERE id = ?",
                  [user.id],
                  (tx, res) => {
                      if (res.rows.length > 0) {
                          // Construir consulta de actualización dinámicamente
                          let updateUserQuery = "UPDATE User SET ";
                          const params = [];

                          if (user.name) {
                              updateUserQuery += "name = ?, ";
                              params.push(user.name);
                          }
                          if (user.username) {
                              updateUserQuery += "username = ?, ";
                              params.push(user.username);
                          }
                          if (user.email) {
                              updateUserQuery += "email = ?, ";
                              params.push(user.email);
                          }
                          if (user.password) {
                              updateUserQuery += "password = ?, ";
                              params.push(user.password);
                          }
                          if (user.salt) {
                              updateUserQuery += "salt = ?, ";
                              params.push(user.salt);
                          }
                          if (user.phone) {
                              updateUserQuery += "phone = ?, ";
                              params.push(user.phone);
                          }

                          // Remover la última coma y espacio
                          updateUserQuery = updateUserQuery.slice(0, -2);
                          updateUserQuery += " WHERE id = ?";
                          params.push(user.id);

                          // Ejecutar la consulta de actualización
                          tx.executeSql(
                              updateUserQuery,
                              params,
                              (tx, res) => {
                                  console.log("Usuario actualizado exitosamente.");
                                  updateUserCloud(user); // Sincronizar con la nube
                                  resolve();
                              },
                              (tx, error) => {
                                  reject(new Error("Error actualizando usuario: " + error.message));
                              }
                          );
                      } else {
                          reject(new Error("Usuario no encontrado."));
                      }
                  },
                  (tx, error) => {
                      reject(new Error("Error verificando el usuario: " + error.message));
                  }
              );
          });
      });
      ons.notification.alert("Usuario actualizado exitosamente.");
  } catch (error) {
      ons.notification.alert(error.message);
  }
};

// obtener a id del usuario con inicio de sesión JWT
const getConcurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return reject("No hay un token de inicio de sesión.");
    }

    try {
      const payload = jwt_decode(token);
      resolve(parseInt(payload.id)); // Asegúrate de que el ID se convierta a un número entero en base 10
    } catch (error) {
      reject(new Error("Error decodificando el token: " + error.message));
    }
  });
};

// obtener el username del usuario con inicio de sesión JWT
const getConcurrentUsername = async () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return reject("No hay un token de inicio de sesión.");
    }

    try {
      const payload = jwt_decode(token);
      resolve(payload.username);
    } catch (error) {
      reject(new Error("Error decodificando el token: " + error.message));
    }
  });
};
