import {Database} from './db/connect.js'
import ENV from "./core/HandleEnv.js";
import cors from 'cors'

import Authentication from './Routes/Authentication/Authentication.js'
import App from "./core/Application.js";
import Candidate from "./Routes/Candidate/Candidate.js";
import Voter from "./Routes/Voter/Voter.js";
import Election from "./Routes/Election/Election.js";

const port = ENV.PORT


Database.connect().then(() => {
    console.log("Connected to Database")
}).catch((err) => {
    console.log(err)
})
App.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
}))

App.use('/candidate', Candidate)
App.use('', Authentication)
App.use('/vote', Voter)
App.use('/election', Election)


App.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})
