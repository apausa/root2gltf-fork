const express = require('express');

const server = express();
const port = process.env.PORT || 5000;

const parseRouter = require('./src/routes/parse.router');

server.use('/api/parse', parseRouter);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
