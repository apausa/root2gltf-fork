import express from 'express';

import { parseFile } from '../controllers/file.controller';

const fileRouter = express.Router();

fileRouter.route('/').post(parseFile);

// eslint-disable-next-line import-x/prefer-default-export
export { fileRouter };
