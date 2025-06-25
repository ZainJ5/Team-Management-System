const express = require('express');
const router = express.Router();
const {
  createtask,
  gettasksforteam,
  completetask
} = require('./task.controller.js');

router.post('/createtask', createtask); 
router.get('/teamtasks/:team_id/:user_id', gettasksforteam);
router.post('/completetask/:task_id', completetask); 

module.exports = router;