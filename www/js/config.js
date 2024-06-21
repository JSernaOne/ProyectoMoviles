// Actualizar Usuario
// Actualizar Usuario
async function update(name, email, username, password, phone) {
  try {
    const userId = await getConcurrentUser(); // Obtener el ID del usuario actual
    const user = { id: userId };

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) {
      const salt = generateSalt();
      const hash = await hashPassword(password, salt);
      user.password = hash;
      user.salt = salt;
    }
    if (phone) user.phone = phone;

    console.log("User Object:", user);

    await updateUser(user);
  } catch (error) {
    ons.notification.alert("Error actualizando el usuario: " + error.message);
  }
}

const closeConfig = () => {
  window.location = "/template/home.html";
};

document.addEventListener("DOMContentLoaded", function (event) {
  checkAuth();
  const button = document.getElementById("updateUser-button");
  button.onclick = async () => {
    const name = document.getElementById("nombre").value;
    const email = document.getElementById("correo").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("contrasena").value;
    const phone = document.getElementById("telefono").value;

    await update(name, email, username, password, phone);
  };
});
