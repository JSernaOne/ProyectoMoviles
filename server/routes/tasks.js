import { Router } from 'express';

export default (connection) => {
    const router = Router();

    router.get('/user', (req, res) => {
        connection.query('SELECT * FROM users', (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    });

    router.post('/Registro', (req, res) => {
        const task = req.body;
        connection.query('INSERT INTO tasks SET ?', task, (error, results) => {
            if (error) throw error;
            res.status(201).send(`Task added with ID: ${results.insertId}`);
        });
    });

    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const task = req.body;
        connection.query('UPDATE tasks SET ? WHERE id = ?', [task, id], (error, results) => {
            if (error) throw error;
            res.send('Task updated successfully.');
        });
    });

    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        connection.query('DELETE FROM tasks WHERE id = ?', id, (error, results) => {
            if (error) throw error;
            res.send('Task deleted.');
        });
    });

    return router;
};
