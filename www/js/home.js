document.addEventListener('init', function(event) {
    var page = event.target;
    if (page.id === "inicio") {
        loadInitialData();
        loadTasks();
        page.querySelector("#add-task-button").onclick = function () {
            window.location.href = "/template/add-task.html";
        };
        page.querySelector("#push-button").onclick = function () {
            window.location.href = "/template/mapa.html";
        };
        page.querySelector("#edit").onclick = function () {
            window.location.href = "/template/edit.html";
        };
    }
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function loadInitialData() {
    const userName = "George"; // Este valor se debe obtener de la base de datos
    const motivationalQuote = "El éxito es la suma de pequeños esfuerzos repetidos día tras día."; // Este valor se debe obtener de la base de datos
    const currentDate = new Date().toLocaleDateString();

    document.getElementById('welcome-message').textContent = `Bienvenido ${userName}`;
    document.getElementById('motivational-quote').textContent = motivationalQuote;
    document.getElementById('current-date').textContent = currentDate;
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '<ons-list-header>Lista de Tareas</ons-list-header>';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('ons-list-item');
        listItem.innerHTML = `
            <label class="left">
                <ons-checkbox data-index="${index}"></ons-checkbox>
            </label>
            <div class="center">${task.text}</div>
        `;
        taskList.appendChild(listItem);

        const checkbox = listItem.querySelector('ons-checkbox');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const index = this.getAttribute('data-index');
                listItem.classList.add('fade-out');
                setTimeout(() => {
                    removeTask(index);
                }, 1000); // Duración igual a la transición CSS
            }
        });
    });
}

function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}


