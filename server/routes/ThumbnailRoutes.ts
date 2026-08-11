import express from 'express';
import { deleteThumbnail, generateThumbnail } from '../controllers/ThumbnailController.js';
import protect from '../middlewares/auth.js';
import checkCredits from '../middlewares/checkCredits.js';

const ThumbnailRouter = express.Router();

ThumbnailRouter.post('/generate', protect, checkCredits, generateThumbnail);
ThumbnailRouter.delete('/delete/:id', protect, deleteThumbnail);

export default ThumbnailRouter;