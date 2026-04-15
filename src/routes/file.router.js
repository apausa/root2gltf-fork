import express from 'express';
import multer from 'multer';

import { parseFile } from '../controllers/file.controller';

const fileRouter = express.Router();
const upload = multer({ dest: '/tmp' });

fileRouter.route('/').post(upload.single('file'), parseFile);

// eslint-disable-next-line import-x/prefer-default-export
export { fileRouter };
