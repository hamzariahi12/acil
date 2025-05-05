import { Router } from "express";
import {addTab,getTable,getTableById,updateTable,deleteTable} from '../controllers/TableController.js';



const router = Router();


router.post('/Add', addTab);
router.get('/get', getTable);
router.get('/get/:id', getTableById);
router.put('/update/:id', updateTable);
router.delete('/delete/:id', deleteTable);

export default router;