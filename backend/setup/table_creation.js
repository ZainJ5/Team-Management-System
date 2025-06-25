const pool = require('../config/db');

async function create_table() {
    try {
        // User table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                password VARCHAR(100) NOT NULL
            )
        `);

        // Team table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id SERIAL PRIMARY KEY,
                created_by INT
            )
        `);

        // Team_member table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS team_members (
                team_id INT,
                user_id INT,
                PRIMARY KEY (team_id, user_id),
                CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
                CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Task table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                created_by INT,
                assigned_to INT,
                team_id INT,
                CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
                CONSTRAINT fk_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
                CONSTRAINT fk_team_task FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
            )
        `);

        console.log('Tables created successfully.');
    } catch (err) {
        console.log('Error occurred while creating tables:', err);
        process.exit(1);
    }
}

module.exports = create_table;
