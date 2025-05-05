import { Router } from "express";
import {addReservation} from '../controllers/ReservationController.js';



const router = Router();


router.post('/AddReservation', addReservation);


export default router;