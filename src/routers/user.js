import express from 'express';
import { forgotPassword, resetPassword } from '../controllers/user.js';

const routerUser = express.Router();

routerUser.post('/forgotpassword', forgotPassword)
routerUser.patch('/resetpassword/:token', resetPassword)

export default routerUser;