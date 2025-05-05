import { Router } from "express";
import {addMenu,getMenu,getMenuById,updateMenu,deleteMenu} from '../controllers/MenuController.js';



const router = Router();


router.post('/Add', addMenu);
router.get('/get', getMenu);
router.get('/get/:id', getMenuById);
router.put('/update/:id', updateMenu);
router.delete('/delete/:id', deleteMenu);

export default router;