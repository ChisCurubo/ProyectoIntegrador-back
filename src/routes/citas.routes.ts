import { EviarDatosHistorialClinico } from "../controllers/citas.controller";
import { Express } from "express";
import express from 'express';
//import { } from "";

const router = express.Router();

router.post('/getHistoryClient',EviarDatosHistorialClinico ),
router.post('/addDescriptionMedicHistory', )
router.post('/readCVSInsert', )

router.get('/', async (req, res) => {
    res.send('Fetching...')
})

router.get('/getUser', (req, res) => {
    res.send('Fetching...1 ')
})

export default router;