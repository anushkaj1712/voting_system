const partyRouter = require('express').Router();
const controller = require('../controller/controller');

partyRouter.post('/addparty', controller.addparty);
partyRouter.post('/vote', controller.vote);
partyRouter.get('/getparty', controller.getparty);

module.exports = partyRouter;