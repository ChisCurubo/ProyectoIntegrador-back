import express from 'express';
import { generatePayStub } from '../controllers/colilla.controller';

const router = express.Router();

router.post('/generatePayStub', generatePayStub);

export default router;