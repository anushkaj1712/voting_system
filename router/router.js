const router = require('express').Router();
const controller = require('../controller/controller');

router.post('/adduser', controller.adduser);
router.get('/getUser', controller.getUser);
router.post('/login', controller.login);
router.put('/update', controller.update);
router.delete('/delete', controller.delete);

// router.post('/party/addparty', controller.addparty);
// router.post('/party/vote', controller.vote);



module.exports = router; 