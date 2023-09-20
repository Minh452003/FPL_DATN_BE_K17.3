import express from 'express';
import passport from 'passport';
import '../controllers/passport.js'
import { LoginWithGoogle, LogoutGoogle } from '../controllers/passport.js';
const routerPassport = express.Router();

routerPassport.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
routerPassport.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: `http://localhost:8088/api/google/success`,
        failureRedirect: `http://localhost:5173/error`
    }));
routerPassport.use('/auth/logout', LogoutGoogle);
routerPassport.use('/google/success', LoginWithGoogle)
export default routerPassport;
