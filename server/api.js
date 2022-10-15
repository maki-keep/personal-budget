const express = require('express');
const envelopesRouter = require('./envelopes/envelopes');

const apiRouter = express.Router();
apiRouter.use('/envelopes', envelopesRouter);

module.exports = apiRouter;
