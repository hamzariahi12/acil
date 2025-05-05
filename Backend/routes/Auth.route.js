import { Router } from "express";
import {signup , login, getUserById, updateUser, deleteUser,requestPasswordReset,resetPassword, getAllUsers} from '../controllers/UserController.js';
//import multer from "multer";


const router = Router();

/* Multer configuration
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname.slice(file.originalname.lastIndexOf('.')));
    }
  });
  const upload = multer({ storage });*/

  
  

//router.post('/signup', upload.single('image'), signup);
router.post('/signup', signup);
router.post('/login', login);
router.get('/:id',getUserById );
router.put('/update/:id',updateUser);
router.delete('/delete/:id', deleteUser);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/allusers',getAllUsers );

//updete
//  reset password

export default router;