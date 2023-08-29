
import express from 'express';
import { logout } from '../controllers/logout.js';

const routerLogout = express.Router();

// Đường dẫn đăng xuất
routerLogout.post('/logout', logout);

export default routerLogout;

