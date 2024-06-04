// guardar tareas en la basse de datos de a nube
const saveTasksCloude = async (tasks) => {
  const validarToken = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3050/api/tasks/saveTasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validarToken}`,
      },
      body: JSON.stringify(tasks),
    });
    if (response.status === 200) {
      console.log("Tareas guardadas exitosamente en la nube.");
    } else {
      console.error(
        "Falló al guardar las tareas en la nube:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Falló al guardar las tareas en la nube:", error.message);
  }
};

const removeTaskFromCloud = async (taskId) => {
  const validarToken = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:3050/api/tasks/deleteTask/${taskId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validarToken}`,
        },
      }
    );
    if (response.status === 200) {
      console.log("Tarea eliminada exitosamente de la nube.");
    } else {
      console.error(
        "Falló al eliminar la tarea de la nube:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Falló al eliminar la tarea de la nube:", error.message);
  }
}