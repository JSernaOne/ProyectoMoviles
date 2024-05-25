// registrar usuarios
function registerUser(name, username, email, password, phone) {
  var salt = generateSalt(); // Generar una sal aleatoria
  var hashedPassword = hashPassword(password, salt); // Aplicar hash a la contraseña + sal*/

  // validar campos
  if (!validateFields([name, username, email, password, phone])) {
    ons.notification.alert("Por favor complete todos los campos.");
    return;
  } else if (!validateName(name)) {
    ons.notification.alert("El nombre solo debe contener letras.");
    return;
  } else if (!validateEmail(email)) {
    ons.notification.alert("Por favor ingrese un email válido.");
    return;
  } else if (!validatePhone(phone)) {
    ons.notification.alert(
      "El teléfono solo debe contener números y máximo 10 digitos."
    );
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT * FROM User WHERE username = ? OR email = ? OR phone = ?",
      [username, email, phone],
      function (tx, res) {
        if (res.rows.length > 0) {
          ons.notification.alert(
            "El username, email o teléfono ya están registrados."
          );
        } else {
          var salt = generateSalt();
          var hashedPassword = hashPassword(password, salt);

          // Insertar nuevo usuario
          tx.executeSql(
            "INSERT INTO User (name, email, username, password, salt, phone) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, username, hashedPassword, salt, phone],
            function (tx, res) {
              ons.notification.alert("Usuario registrado exitosamente.");
            },
            function (tx, error) {
              ons.notification.alert(
                "Error registrando usuario: " + error.message
              );
            }
          );
        }
      },
      function (tx, error) {
        ons.notification.alert("Error verificando usuario: " + error.message);
      }
    );
  });
}

function generateSalt() {
  // Generar una cadena de sal aleatoria, por ejemplo, utilizando una función criptográficamente segura
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function hashPassword(password, salt) {
  // Concatenar la contraseña y la sal
  const passwordWithSalt = password + salt;

  // Aplicar un algoritmo de hash a la contraseña + sal
  const hashedPassword = sha256(passwordWithSalt);

  return hashedPassword;
}

/**
 *
 *
 * Fución que no se utilizara en el despliegue de la aplicación
 *
 *
 */
// ver usuarios
function viewUsers() {
  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM User", [], function (tx, res) {
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

// iniciar sesión
function login(username, password) {
  if (!validateFields([username, password])) {
    ons.notification.alert("Por favor complete todos los campos.");
    return;
  }

  db.transaction(function (tx) {
    tx.executeSql(
      "SELECT salt, password FROM User WHERE username = ?",
      [username],
      function (tx, res) {
        if (res.rows.length > 0) {
          var salt = res.rows.item(0).salt;
          var hashedPassword = hashPassword(password, salt);
          var storedPassword = res.rows.item(0).password;
          if (hashedPassword === storedPassword) {
            updateLastLogin(username);
            window.location.href = "home.html";
          } else {
            ons.notification.alert("Contraseña incorrecta.");
          }
        } else {
          ons.notification.alert("Usuario no encontrado.");
        }
      },
      function (tx, error) {
        ons.notification.alert("Error al iniciar sesión: " + error.message);
      }
    );
  });
}
// actualizar last_login
function updateLastLogin(username) {
  db.transaction(function (tx) {
    tx.executeSql(
      "UPDATE User SET last_login = ? WHERE username = ?",
      [new Date().toLocaleString(), username],
      function (tx, res) {
        console.log("last_login actualizado.");
      },
      function (tx, error) {
        ons.notification.alert("Error actualizando last_login: " + error.message);
      }
    );
  });
}

// Validar campos del formulario
function validateFields(fields) {
  return fields.every((field) => field.trim() !== "");
}

// validar nombres de usuario
// Sin simbolos especiales, ni numros
// Solo letras
/*^ indica que el patrón debe iniciar con los caracteres dentro de los corchetes
[A-Z] indica que los caracteres admitidos son letras del alfabeto
+ indica que los caracteres dentro de los corchetes se pueden repetir
$ indica que el patrón finaliza con los caracteres que están dentro de los corchetes.
i indica que validaremos letras mayúsculas y minúsculas (case-insensitive)*/
function validateName(name) {
  const pattern = /^[A-Z]+$/i; // Expresión regular para validar solo letras en mayúsculas y minúsculas
  return pattern.test(name);
}

function validateEmail(email) {
  const pattern = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/; // Expresión regular para validar un email
  return pattern.test(email);
}

//validar numero de telefono
function validatePhone(phone) {
  if (phone.length < 10) {
    return false;
  }
  const pattern = /^[0-9]+$/; // Expresión regular para validar solo números
  return pattern.test(phone);
}

// evento de inicialización de la aplicación con Onsen UI para cargar las páginas de la aplicación
document.addEventListener("init", function (event) {
  var page = event.target; // Página actual cargada

  // Página de inicio
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
      (user = page.querySelector("#username").value),
        (password = page.querySelector("#password").value);
      login(user, password);
    };
    page.querySelector("#show-users").onclick = function () {
      viewUsers();
    };

    // Página de registro
  } else if (page.id === "registro") {
    page.querySelector("ons-toolbar .center").innerHTML = page.data.title;
    page.querySelector("#registro-button").onclick = function () {
      registerUser(
        page.querySelector("#nombre").value,
        page.querySelector("#username_register").value,
        page.querySelector("#correo").value,
        page.querySelector("#contrasena").value,
        page.querySelector("#telefono").value
      );
    };
    page.querySelector("#actualizar-button").onclick = function () {
      update();
    };

    // Página de consultas
  } else if (page.id === "consultas") {
    page.querySelector("ons-toolbar .center").innerHTML = page.data.title;
    page.querySelector("#consulta-button").onclick = function () {
      viewEmail();
    };
    page.querySelector("#eliminar-button").onclick = function () {
      deleteUser();
    };
  }
});
