import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'mysql';
import tasksRouter from './routes/tasks.js';

const app = express();

app.use(bodyParser.json());

const connection = createConnection({
    host: '172.17.0.2',     // Dirección del host de tu base de datos MySQL
    user: 'root',         // Nombre de usuario de tu base de datos MySQL
    password: 'root',     // Contraseña de tu base de datos MySQL
    database: 'gestionTareas', // Nombre de tu base de datos MySQL
    port: 3306
});

connection.connect(err => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL');
    }
}
);

app.use('/tasks', tasksRouter(connection));

app.listen(3050, () => {
    console.log('Server is running on port 3306');
});
