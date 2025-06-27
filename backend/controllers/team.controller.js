const pool = require('../config/db');

exports.createteam = async (req, res) => {
    try {
        const { user_id, name, description } = req.body;

        const insertteam = await pool.query(
            'INSERT INTO teams (created_by, name, description) VALUES ($1, $2, $3) RETURNING id',
            [user_id, name, description]
        );

        const teamId = insertteam.rows[0].id;

        await pool.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
            [teamId, user_id]
        );

        res.status(200).json({ team_id: teamId });
    } catch (err) {
        console.error('Error creating team:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getallteams = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, 
                   u.name as creator_name,
                   COUNT(tm.user_id) as member_count
            FROM teams t
            LEFT JOIN users u ON t.created_by = u.id
            LEFT JOIN team_members tm ON t.id = tm.team_id
            GROUP BY t.id, u.name
            ORDER BY t.created_at DESC
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching teams:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteteam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const { user_id } = req.body; 

        const result = await pool.query(
            'SELECT created_by FROM teams WHERE id = $1',[teamId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        const createdBy = result.rows[0].created_by;

        if (createdBy !== parseInt(user_id)) {
            return res.status(403).json({ error: 'Only the team creator (admin) can delete this team' });
        }

        await pool.query('DELETE FROM teams WHERE id = $1', [teamId]);

        res.status(200).json({ message: `Team with ID ${teamId} deleted.` });
    } catch (err) {
        console.error('Error deleting team:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addmember = async (req, res) => {
    try {
        const { team_id, user_id } = req.body;

        await pool.query(
            'INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)',
            [team_id, user_id]
        );

        res.status(200).json({ message: 'Member added to team successfully.' });
    } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.removemember = async (req, res) => {
    try {
        const { team_id, user_id } = req.body;

        await pool.query(
            'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2',[team_id, user_id]
        );

        res.status(200).json({ message: 'Member removed from team successfully.' });
    } catch (err) {
        console.error('Error removing member:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};