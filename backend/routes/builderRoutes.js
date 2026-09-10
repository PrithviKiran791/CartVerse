import express from 'express';
import {
  validateBuild,
  getPrebuiltRigs,
} from '../controllers/builderController.js';

const router = express.Router();

router.post('/validate', validateBuild);
router.get('/prebuilts', getPrebuiltRigs);

export default router;
