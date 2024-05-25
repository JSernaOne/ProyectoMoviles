document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.id === 'main-page') {
        // Cargar datos iniciales
        loadInitialData();
    }
});

function loadInitialData() {
    // Aquí se deberían hacer las llamadas a la base de datos para obtener los datos
    const userName = "George"; // Este valor se debe obtener de la base de datos
    const motivationalQuote = "El éxito es la suma de pequeños esfuerzos repetidos día tras día."; // Este valor se debe obtener de la base de datos
    const currentDate = new Date().toLocaleDateString();

    document.getElementById('welcome-message').textContent = `Bienvenido ${userName}`;
    document.getElementById('motivational-quote').textContent = motivationalQuote;
    document.getElementById('current-date').textContent = currentDate;
}

document.getElementById('add-task-button').addEventListener('click', function() {
    showDialog();
});

function showDialog() {
    var dialog = document.getElementById('dialog');

    if (dialog) {
        dialog.show();
    } else {
        ons.createElement('add-task-dialog', { append: true })
            .then(function(dialog) {
                dialog.show();
            });
    }
}

function hideDialog() {
    document.getElementById('dialog').hide();
}

function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const taskList = document.getElementById('task-list');
        const listItem = document.createElement('ons-list-item');
        listItem.innerHTML = `
            <label class="left">
                <ons-checkbox></ons-checkbox>
            </label>
            <div class="center">
                ${taskText}
            </div>
        `;
        taskList.appendChild(listItem);
        taskInput.value = '';
        hideDialog();
    }
}

function navigateTo(page) {
    // Aquí puedes agregar la lógica para navegar a otras páginas
    console.log(`Navegar a ${page}`);
}
