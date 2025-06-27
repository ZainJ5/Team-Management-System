const express = require('express');
const router = express.Router();
const {
  createtask,
  gettasksforteam,
  completetask,
  getUserActivity,
  getUserStats
} = require('../controllers/task.controller');

const middleware = require('../middleware/auth')

router.use(middleware)

router.post('/createtask', createtask); 
router.get('/teamtasks/:team_id/:user_id', gettasksforteam);
router.post('/completetask/:task_id', completetask);
router.get('/user-activity', getUserActivity); 
router.get('/user-stats', getUserStats); 

module.exports = router;