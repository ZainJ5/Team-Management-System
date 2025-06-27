const express = require('express');
const router = express.Router();
const {
  createteam,
  deleteteam,
  getallteams,
  addmember,
  removemember,
  getAvailableUsers
} = require('../controllers/team.controller');

const middleware = require('../middleware/auth')

router.use(middleware)

router.post('/createteam', createteam);
router.get('/allteams', getallteams);
router.post('/deleteteam/:id', deleteteam);
router.post('/addmember', addmember);
router.post('/removemember', removemember);
router.get('/available-users/:team_id', getAvailableUsers);

module.exports = router;