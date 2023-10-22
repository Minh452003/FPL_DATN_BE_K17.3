import express from 'express';
import { changePassword, forgotPassword, resetPassword, verifyOTPResetPassword } from '../controllers/user.js';
import { authenticate } from '../middlewares/authenticate.js';

const routerUser = express.Router();

routerUser.post('/forgotpassword', forgotPassword)
routerUser.post('/verifyOTPResetPassword', verifyOTPResetPassword)
routerUser.patch('/resetpassword', resetPassword)
routerUser.patch('/changepassword', authenticate, changePassword)

export default routerUser;