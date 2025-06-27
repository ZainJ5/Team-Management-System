const pool = require('../config/db');

exports.createtask = async (req, res) => {
    try {
        const { created_by, assigned_to, team_id, title, description, priority, due_date } = req.body;

        const result = await pool.query(
            'INSERT INTO tasks (created_by, assigned_to, team_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [created_by, assigned_to, team_id, title, description, priority, due_date]
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

        const tasks = await pool.query(`
            SELECT t.*, 
                   creator.name as creator_name,
                   assignee.name as assigned_user_name
            FROM tasks t
            LEFT JOIN users creator ON t.created_by = creator.id
            LEFT JOIN users assignee ON t.assigned_to = assignee.id
            WHERE t.team_id = $1
            ORDER BY t.created_at DESC
        `, [team_id]);

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
            'UPDATE tasks SET completed = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1',[task_id]
        );

        res.status(200).json({ message: 'Task marked as completed.' });
    } catch (err) {
        console.error('Error completing task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getUserActivity = async (req, res) => {
    try {
        const userId = req.user?.id; 

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const activities = await pool.query(`
            SELECT DISTINCT t.*, 
                   creator.name as creator_name,
                   assignee.name as assigned_user_name,
                   teams.name as team_name,
                   teams.id as team_id
            FROM tasks t
            LEFT JOIN users creator ON t.created_by = creator.id
            LEFT JOIN users assignee ON t.assigned_to = assignee.id
            LEFT JOIN teams ON t.team_id = teams.id
            LEFT JOIN team_members tm ON t.team_id = tm.team_id
            WHERE t.created_by = $1 
               OR t.assigned_to = $1 
               OR tm.user_id = $1
            ORDER BY t.updated_at DESC, t.created_at DESC
            LIMIT 10
        `, [userId]);

        res.status(200).json(activities.rows);
    } catch (err) {
        console.error('Error fetching user activity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const teamStats = await pool.query(`
            SELECT COUNT(DISTINCT team_id) as team_count
            FROM (
                SELECT id as team_id FROM teams WHERE created_by = $1
                UNION
                SELECT team_id FROM team_members WHERE user_id = $1
            ) as user_teams
        `, [userId]);

        const allTasksResult = await pool.query(`
            SELECT DISTINCT t.id, t.completed
            FROM tasks t
            LEFT JOIN team_members tm ON t.team_id = tm.team_id
            WHERE t.created_by = $1 
               OR t.assigned_to = $1 
               OR tm.user_id = $1
        `, [userId]);

        const allTasks = allTasksResult.rows;
        const totalTasks = allTasks.length;
        const completedTasks = allTasks.filter(task => task.completed === true).length;
        const activeTasks = totalTasks - completedTasks;

        const stats = {
            teams: parseInt(teamStats.rows[0].team_count) || 0,
            total_tasks: totalTasks,
            active_tasks: activeTasks,
            completed_tasks: completedTasks
        };

        console.log('User Stats for user', userId, ':', stats);
        console.log('All tasks:', allTasks.map(t => ({ id: t.id, completed: t.completed })));

        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching user stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};