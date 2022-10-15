const express = require('express');
const envelopesRouter = express.Router();

module.exports = envelopesRouter;

const {
  getEnvelopes,
  createEnvelope,
  getEnvelopeById,
  deleteEnvelopeById,
  updateEnvelope,
  transferEnvelopeBudget
} = require('../db');

envelopesRouter.param('id', (req, res, next, id) => {
  const envelope = getEnvelopeById(id);
  if (envelope) {
    req.envelope = envelope;
    next();
  } else {
    res.status(404).send();
  }
});

envelopesRouter.param('from', (req, res, next, id) => {
  const envelope = getEnvelopeById(id);
  if (envelope) {
    req.fromEnvelope = envelope;
    next();
  } else {
    res.status(404).send();
  }
});

envelopesRouter.param('to', (req, res, next, id) => {
  const envelope = getEnvelopeById(id);
  if (envelope) {
    req.toEnvelope = envelope;
    next();
  } else {
    res.status(404).send();
  }
});

envelopesRouter.get('/', (req, res, next) => {
  res.send(getEnvelopes());
});

envelopesRouter.post('/', (req, res, next) => {
  const newEnvelope = createEnvelope(req.body);
  res.status(201).send(newEnvelope);
});

envelopesRouter.get('/:id', (req, res, next) => {
  res.send(req.envelope);
});

envelopesRouter.delete('/:id', (req, res, next) => {
  const deletedEnvelope = deleteEnvelopeById(req.params.id);
  if (deletedEnvelope) {
    res.status(204).send();
  } else {
    res.status(500).send();
  }
});

envelopesRouter.put('/:id', (req, res, next) => {
  res.send(updateEnvelope(req.body, req.params.id));
});

envelopesRouter.post('/transfer/:from/:to', (req, res, next) => {
  const transfer = transferEnvelopeBudget(req.fromEnvelope, req.toEnvelope, req.params.from, req.params.to);
  res.status(201).send(transfer);
});
