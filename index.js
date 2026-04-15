import express from 'express';

import parseRouter from './src/routes/parse.router.js';

const server = express();
const port = process.env.PORT || 5000;

server.use('/api/parse', parseRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
