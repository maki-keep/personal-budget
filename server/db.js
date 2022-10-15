/*
  envelope item
  {
    id: number,
    title: string, // request.body
    budget: number // request.body
  }
*/
const db = {
  // last id
  _last_id: 0,
  get last_id() {
    return this._last_id;
  },
  /**
   * @param {number} par
   */
  set last_id(par) {
    this._last_id = par;
  },
  getNextId: () => {
    this.last_id++;
    return this.last_id;
  },

  // total budget
  _total_budget: 0,
  get total_budget() {
    return this._total_budget;
  },
  /**
   * @param {number} par
   */
  set total_budget(par) {
    this._total_budget = par;
  },
  /**
   * @param {number} amount
   */
  updateTotalBudget: (amount) => {
    this.total_budget += amount;
  },

  //envelopes
  envelopes: {
    items: []
  }
};

const isValidEnvelope = (body) => {
  body.title = body.title || '';
  body.budget = body.budget || 0;
  if (typeof body.title !== 'string') {
    throw new Error('Envelope title must be a string.');
  }
  if (isNaN(body.budget) || !isFinite(body.budget)) {
    throw new Error('Envelope budget must be a number.');
  } else {
    body.budget = Number(body.budget);
  }
  return true;
};

const enoughBudget = (body) => {
  if (body.budget <= db.total_budget) {
    throw new Error('Not enough budget.');
  }
  return true;
};

const getEnvelopes = () => {
  return db.envelopes;
};

const createEnvelope = (body) => {
  if (!isValidEnvelope(body)) {
    return null;
  }
  const { items } = db.envelopes;
  items.push({
    id: db.getNextId(),
    title: body.title,
    budget: body.budget
  });
  db.updateTotalBudget(body.budget);
  return items[items.length - 1];
};

const getEnvelopeById = (id) => {
  return db.envelopes.items.find(item => item.id === id);
};

const getEnvelopeIndexById = (id) => {
  return db.envelopes.items.findIndex(item => item.id === id);
};

const deleteEnvelopeById = (id) => {
  return db.envelopes.items.filter(item => item.id !== id);
};

const updateEnvelope = (body, id) => {
  if (!(isValidEnvelope(body) && enoughBudget(body))) {
    return null;
  }
  const { items } = db.envelopes;
  const index = getEnvelopeIndexById(id);
  if (index > -1) {
    items[index] = body;
    db.updateTotalBudget(body.budget);
    return items[index];
  } else {
    return null;
  }
};

const transferEnvelopeBudget = (fromEnvelope, toEnvelope, fromId, toId) => {
  if (!(isValidEnvelope(fromEnvelope) && isValidEnvelope(toEnvelope) && enoughBudget(fromEnvelope))) {
    return null;
  }
  const { items } = db.envelopes;
  const fromIndex = getEnvelopeIndexById(fromId);
  const toIndex = getEnvelopeIndexById(toId);
  if (fromIndex > -1 && toIndex > -1) {
    items[fromIndex].budget -= fromEnvelope.budget;
    items[toIndex].budget += toEnvelope.budget;
    return fromEnvelope.budget;
  } else {
    return null;
  }
};

/* seed database with starting envelopes */
const seedEnvelopes = () => {
  createEnvelope({
    title: "First",
    budget: 200
  });
  createEnvelope({
    title: "Second",
    budget: 150
  });
};

seedEnvelopes();

module.exports = {
  getEnvelopes,
  createEnvelope,
  getEnvelopeById,
  deleteEnvelopeById,
  updateEnvelope,
  transferEnvelopeBudget
};
