import express from 'express';
import { changePassword, forgotPassword, resetPassword } from '../controllers/user.js';
import { authenticate } from '../middlewares/authenticate.js';

const routerUser = express.Router();

routerUser.post('/forgotpassword', forgotPassword)
routerUser.patch('/resetpassword/:token', resetPassword)
routerUser.patch('/changepassword', authenticate, changePassword)

export default routerUser;