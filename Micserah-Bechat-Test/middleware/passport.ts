import User, {UserDocument} from '../model/usermodel';
import dotenv from 'dotenv';
dotenv.config();
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { ErrorCallback } from 'typescript';

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN as string
}

const Auth = (passport: any) => {
    passport.use(
        new Strategy(options, async(payload, done) => {
            await User.findById(payload.user_id).then(user => {
            if(user){
                done(null, user);
                return;
            }
                done(null, false);
                return;
            
        })
        .catch(err => {
            done(null, false); 
            return;
        });
    })
    
    );
    passport.serializeUser(function (user: UserDocument, done: VerifiedCallback) {
       done(null, user._id);
       return;
    });

    passport.deserializeUser(function (id: UserDocument, done: VerifiedCallback) {
        User.findById(id, function (err: ErrorCallback, user: UserDocument) {
            done(err, user);
            return;
        });
    });
};

export default Auth;