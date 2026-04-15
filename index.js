import express from 'express';

import { fileRouter } from './src/routes/file.router';

const app = express();
const port = process.env.PORT || 5000;

app.use('/api/parse', fileRouter);
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
