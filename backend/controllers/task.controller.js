const pool = require('../config/db');

exports.createtask = async (req, res) => {
    try {
        const { created_by, assigned_to, team_id } = req.body;

        const result = await pool.query(
            'INSERT INTO tasks (created_by, assigned_to, team_id) VALUES ($1, $2, $3) RETURNING *',[created_by, assigned_to, team_id]
        );
        res.status(200).json({ message: 'Task created successfully.', task: result.rows[0] });
    } catch (err) {
        console.log('Error creating task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.gettasksforteam = async (req, res) => {
    try {
        const { team_id, user_id } = req.params;

        const memberCheck = await pool.query(
            'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',[team_id, user_id]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({ error: 'You are not a member of this team.' });
        }

        const tasks = await pool.query(
            'SELECT * FROM tasks WHERE team_id = $1',[team_id]
        );

        res.status(200).json(tasks.rows);
    } catch (err) {
        console.error('Error fetching team tasks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.completetask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const { user_id } = req.body;

        const taskRes = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',[task_id]
        );

        if (taskRes.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        const task = taskRes.rows[0];

        if (task.assigned_to !== parseInt(user_id)) {
            return res.status(403).json({ error: 'Only the assigned user can complete this task.' });
        }

        await pool.query(
            'ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE'
        );

        await pool.query(
            'UPDATE tasks SET completed = true WHERE id = $1',[task_id]
        );

        res.status(200).json({ message: 'Task marked as completed.' });
    } catch (err) {
        console.error('Error completing task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
