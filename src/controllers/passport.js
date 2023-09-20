import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
    clientID: "563215821470-u1ptu5gn9ndnpbcqgauvk3h860pensfa.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8088/api/auth/google/callback",
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
        const isExitUser = await User.findOne({
            googleId: profile.id,
            authType: "google"
        })
        if (isExitUser) {
            const token = jwt.sign({ id: isExitUser._id }, "DATN", { expiresIn: "2h" });
            return done(null, { user: isExitUser, accessToken: token });

        }

        const newUser = new User({
            authType: 'google',
            googleId: profile.id,
            first_name: profile.name.familyName,
            last_name: profile.name.givenName,
            email: profile.emails[0].value,
            avatar: {
                url: profile.picture,
                publicId: null
            },
            password: "Không có mật khẩu",
            phone: "Chưa có số điện thoại",
            address: "Chưa có địa chỉ"
        })
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, "DATN", { expiresIn: "2h" });
        done(null, { user: newUser, accessToken: token });
    }
));

passport.serializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});
passport.deserializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});

export const LoginWithGoogle = (req, res) => {
    const { accessToken } = req.user;
    res.redirect(`http://localhost:5173/success/?token=${accessToken}`);
}

export const LogoutGoogle = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.redirect(process.env.CLIENT_URL);
        }
        res.redirect(process.env.CLIENT_URL);
    });
}