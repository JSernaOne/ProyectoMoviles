document.addEventListener("init", function (event) {
    var page = event.target;
    if (page.id === "configuracion") {
        page.querySelector("#updateUser-button").onclick = function () {
            updateUser(
                page.querySelector("#nombre").value,
                page.querySelector("#username_register").value,
                page.querySelector("#correo").value,
                page.querySelector("#contrasena").value,
                page.querySelector("#telefono").value
            );
        };
        
    }
});

// Actualizar Usuario
const updateUser = async (user) => {
    try {
        await new Promise((resolve, reject) => {
            const token = localStorage.getItem("token");
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE User SET name = ?, username = ?, phone = ? WHERE id = ?",
                    [user.name, user.username, user.phone, token.id],
                    (tx, res) => {
                        console.log("Usuario actualizado exitosamente.");
                        //updateUserCloud(user);
                        resolve();
                    },
                    (tx, error) => {
                        reject(new Error("Error actualizando usuario: " + error.message));
                    }
                );
            });
        });

    } catch (error) {
        ons.notification.alert(error.message);
    }
}

const closeConfig = () => {
    window.location = "/template/home.html";
}