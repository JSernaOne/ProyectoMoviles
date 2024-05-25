document.addEventListener('DOMContentLoaded', function() {
    fetch('home.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('app-content').innerHTML = data;
            // Inicia el script específico para el contenido después de cargar el HTML
            const script = document.createElement('script');
            script.src = 'js/home.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error cargando el contenido:', error));
});
