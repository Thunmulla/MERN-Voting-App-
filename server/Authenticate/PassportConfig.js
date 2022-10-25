import passport from "passport";
import {client, Database} from "../db/connect.js";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import session from "express-session";
import App from "../core/Application.js";
import MongoStore from 'connect-mongo'
import ENV from "../core/HandleEnv.js";

const options = {
    client,
    dbName: ENV.DB_NAME,
    collection: 'sessions',
    ttl: 20,
}
App.use(session({
    secret: "veryGood",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(options),
}))
App.use(passport.initialize(undefined))
App.use(passport.session(undefined))
passport.serializeUser(function (user, done) {
    done(null, user._id)
})
passport.deserializeUser(async function (id, done) {
    const result = await Database.findById("users", id)
    if (result) done(null, result)
    else done(null, false)
})
//Use the express router
const LocalStrategy = passportLocal.Strategy
console.log()
passport.use("local", new LocalStrategy({}, function (username, password, done) {
    Database.getCollection('users').findOne({username: username}, function (err, user) {
            if (err) return done(err)
            if (!user) return done(null, false, {message: 'Incorrect username'})
            bcrypt.compare(password, user.password, function (err, res) {
                    if (err) return done(err)
                    if (res) return done(null, user)
                    else return done(null, false, {message: 'Incorrect password'})
                }
            )
        }
    )
}));

export default passport