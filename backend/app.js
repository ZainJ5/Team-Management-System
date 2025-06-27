require('dotenv').config();
const express = require('express')
const cors = require('cors')
const create_table = require('./setup/table_creation')

const authroute = require('./routes/auth.route')
const teamroute = require('./routes/team.route')
const taskroute = require('./routes/task.route')

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',       
  methods: ['GET', 'POST']
}))

app.use('/api/auth',authroute)
app.use('/api/teams',teamroute)
app.use('/api/tasks',taskroute)

const PORT = process.env.PORT || 5000 

create_table().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch((error) => {
  console.error('Failed to create tables:', error);
  process.exit(1);
});
