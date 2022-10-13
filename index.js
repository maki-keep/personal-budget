const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const apiRouter = require('./server/api');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
