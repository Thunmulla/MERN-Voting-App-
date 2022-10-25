import router from "../index.js";
import {Database as User} from "../../db/connect.js";
import passport from "../../Authenticate/PassportConfig.js";
import bcrypt from "bcrypt";

const TestUser = {
    _id: 2,
    name: "Demo User",
    email: "Demo Mail",
    password: "1234",
}
const IsAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login-failed')
}
const IsNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

router.post('/register', async (req, res) => {
    const {username, password, firstname, lastname, email, role} = req.body
    let id = "";
    let user = {};
    if (role === "Candidate") {
        user = {
            _id: "Cd" + await bcrypt.hash(username + email, 10),
            username: username,
            password: await bcrypt.hash(password, 10),
            firstname: firstname,
            lastname: lastname,
            email: email,
            role: role,
            votes: 0,
            Elections: [],
        }
    } else if (role === "Voter") {
        user = {
            _id: "Vt" + await bcrypt.hash(username + email, 10),
            username: username,
            password: await bcrypt.hash(password, 10),
            firstname: firstname,
            lastname: lastname,
            email: email,
            role: role,
            Elections: [],
        }

    } else if (role === "Manager") {
        user = {
            _id: "Mg" + await bcrypt.hash(username + email, 10),
            username: username,
            password: await bcrypt.hash(password, 10),
            firstname: firstname,
            lastname: lastname,
            email: email,
            role: role,
            Elections: [],
        }
    }

    try {
        const AlreadyExists = await User.getCollection("users").findOne({username: username})
        if (AlreadyExists) {
            res.status(400).send({status: "failed", message: "User Name Already Exists! Choose Another One"})
        } else {
            const result = await User.InsertOne("users", user)
            res.status(200).json({message: "User Registered", status: "success"})
        }

    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({message: "User already exists"})
        } else {
            res.status(400).json({message: "Error registering user"})
        }
    }
})
router.get('/login', IsAuthenticated, async (req, res) => {
    res.json({message: "User Logged In", user: await req.user})
})
router.get('/getUser', IsAuthenticated, async (req, res) => {
    res.json({message: "User Logged In", user: req.user})
})
router.get('/login-failed', IsNotAuthenticated, async (req, res) => {
    console.log("Login Failed")
    res.status(401).json({success: false, message: "Incorrect Log In Credentials"})
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-failed',
    failureMessage: true
}), (req, res) => {
    res.json({message: "User Logged In", user: req.user})
})
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({message: "User Logged Out", success: true})
    })
})
router.get('/setup', async (req, res) => {
    const exist = await User.findOne("users", {username: 'admin'})
    if (exist) {
        res.send({message: "User already exists"})
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err)
            bcrypt.hash("pass", salt, function (err, hash) {
                const TestUser = {
                    _id: 2,
                    username: "admin",
                    email: "Demo Mail",
                    password: hash,
                }
                User.InsertOne("users", TestUser)
                res.status(200).json({message: "User Registered"})
            })
        })
    }


})

export {IsNotAuthenticated, IsAuthenticated}
export default router