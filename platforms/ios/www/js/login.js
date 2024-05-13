// impiortar la base de datos en el archivo login.js para poder hacer uso de ella
importScripts("myBD.js");

document.addEventListener("deviceready", onDeviceReady, false);

function register() {
  var name = getValue("nombre");
  var email = getValue("correo");
  var username = getValue("username_register");
  var password = getValue("contrasena");
  var phone = getValue("telefono");

  if (!validateFields([name, email, username, password, phone])) {
    ons.notification.alert("Por favor llene todos los campos.");
    return;
  }

  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (tx, res) {
        if (res.rows.length === 0) {
          // El correo no está en uso, se puede registrar el usuario
          tx.executeSql(
            "INSERT INTO users (name, email, username, password, phone) VALUES (?, ?, ?, ?, ?)",
            [name, email, username, password, phone],
            function (tx, res) {
              ons.notification.alert("Usuario registrado exitosamente.");
              limpiarCampos();
            },
            function (tx, error) {
              ons.notification.alert("Error registrando usuario: " + error.message);
            }
          );
        } else {
          ons.notification.alert("Correo ya registrado. Por favor ingrese otro.");
        }
      },
      function (tx, error) {
        ons.notification.alert("Error al validar correo: " + error.message);
      }
    );
  });
}


function actualizar() {
  var name = getValue("nombre");
  var email = getValue("correo");
  var username = getValue("username_register");
  var password = getValue("contrasena");
  var phone = getValue("telefono");

  if (email === "") {
    ons.notification.alert("Por favor ingrese un correo.");
    return;
  }

  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (tx, res) {
        if (res.rows.length > 0) {
          var updateUserQuery = "UPDATE users SET ";
          var params = [];

          if (name !== "") {
            updateUserQuery += "name = ?, ";
            params.push(name);
          }
          if (username !== "") {
            updateUserQuery += "username = ?, ";
            params.push(username);
          }
          if (password !== "") {
            updateUserQuery += "password = ?, ";
            params.push(password);
          }
          if (phone !== "") {
            updateUserQuery += "phone = ?, ";
            params.push(phone);
          }

          updateUserQuery = updateUserQuery.slice(0, -2) + " WHERE email = ?";
          params.push(email);

          db.transaction(function (tx) {
            tx.executeSql(
              updateUserQuery,
              params,
              function (tx, res) {
                ons.notification.alert("Usuario actualizado exitosamente.");
                limpiarCampos();
              },
              function (tx, error) {
                ons.notification.alert("Error al actualizar el usuario: " + error.message);
              }
            );
          });
        } else {
          ons.notification.alert("Correo ya existe. Por favor ingrese otro.");
        }
      },
      function (tx, error) {
        ons.notification.alert(
          "Error al validar correo " + error.message
        );
      }
    );
  });
}
function deleteUser() {
  var email = getValue("correo_consulta");

  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (tx, res) {
        if (res.rows.length > 0) {
          tx.executeSql(
            "DELETE FROM users WHERE email = ?",
            [email],
            function (tx, res) {
              ons.notification.alert("Usuario eliminado exitosamente.");
            },
            function (tx, error) {
              ons.notification.alert("Error al eliminar el usuario: " + error.message);
            }
          );
        } else {
          ons.notification.alert("Correo no existe.");
        }
      },
      function (tx, error) {
        ons.notification.alert("Error al validar el correo " + error.message);
      }
    );
  });
}


function login() {
  var username = getValue("username");
  var password = getValue("password");

  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      function (tx, res) {
        if (
          res.rows.length > 0 &&
          res.rows.item(0).username === username &&
          res.rows.item(0).password === password
        ) {
          limpiarCamposLogin();
          window.location.href = "home.html";
        } else {
          ons.notification.alert("Usuario o contraseña incorrectos.");
          limpiarCamposLogin();
        }
      },
      function (tx, error) {
        ons.notification.alert("Error executing SQL: " + error.message);
      }
    );
  });
}

function mostrarPorCorreo() {
  var email = getValue("correo_consulta");
  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM users WHERE email = ?",
      [email],
      function (tx, res) {
        const users = document.getElementById("consultas-list");
        var items = users.querySelectorAll("ons-list-item");
        items.forEach(function (item) {
          item.remove();
        });
        if (res.rows.length > 0 && res.rows.item(0).email === email) {
          var user = res.rows.item(0);
          var item = document.createElement("ons-list-item");
          item.innerHTML =
            "Username: " + user.name + " - Correo: " + user.email;
          users.appendChild(item);
        }
      }
    );
  });
}

function mostrarUsers() {
  var db = openDatabase();

  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM users", [], function (tx, res) {
      const users = document.getElementById("users-list");
      var items = users.querySelectorAll("ons-list-item");
      items.forEach(function (item) {
        item.remove();
      });
      for (var i = 0; i < res.rows.length; i++) {
        var user = res.rows.item(i);
        var item = document.createElement("ons-list-item");
        item.innerHTML = "Username: " + user.name + " - Correo: " + user.email;
        users.appendChild(item);
      }
    });
  });
}


function limpiarCampos() {
  setValue("nombre", "");
  setValue("correo", "");
  setValue("username_register", "");
  setValue("contrasena", "");
  setValue("telefono", "");
}

function limpiarCamposLogin() {
  setValue("username", "");
  setValue("password", "");
}

function openDatabase() {
  return window.sqlitePlugin.openDatabase({
    name: "my.db",
    location: "default",
  });
}

function getValue(id) {
  return document.getElementById(id).value;
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function validateFields(fields) {
  for (var i = 0; i < fields.length; i++) {
    if (fields[i] === "") {
      return false;
    }
  }
  return true;
}

document.addEventListener("init", function (event) {
  var page = event.target;

  if (page.id === "inicio") {
    page.querySelector("#push-registro").onclick = function () {
      document
        .querySelector("#myNavigator")
        .pushPage("registro.html", { data: { title: "Registro" } });
    };
    page.querySelector("#push-consultas").onclick = function () {
      document
        .querySelector("#myNavigator")
        .pushPage("consultas.html", { data: { title: "Consultas" } });
    };
    page.querySelector("#login-button").onclick = function () {
      login();
    };
    page.querySelector("#show-users").onclick = function () {
      mostrarUsers();
    };
  } else if (page.id === "registro") {
    page.querySelector("ons-toolbar .center").innerHTML = page.data.title;
    page.querySelector("#registro-button").onclick = function () {
      register();
    };
    page.querySelector("#actualizar-button").onclick = function () {
      actualizar();
    };
  } else if (page.id === "consultas") {
    page.querySelector("ons-toolbar .center").innerHTML = page.data.title;
    page.querySelector("#consulta-button").onclick = function () {
      mostrarPorCorreo();
    };
    page.querySelector("#eliminar-button").onclick = function () {
      deleteUser();
    };
  }
});
