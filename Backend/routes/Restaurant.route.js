import { Router } from "express";
import {addRes,getRestaurant,getRestaurantById,updateRestaurant,deleteRestaurant,AddTableToRestaurant} from '../controllers/RestaurantController.js';



const router = Router();


router.post('/Add', addRes);
router.get('/get', getRestaurant);
router.get('/get/:id', getRestaurantById);
router.put('/update/:id', updateRestaurant);
router.delete('/delete/:id', deleteRestaurant);
router.post('/AddTableToRestaurant', AddTableToRestaurant);

export default router;