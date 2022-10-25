import router from "../index.js";
import bcrypt from "bcrypt";
import {Database} from "../../db/connect.js";

router.post('/addElection', async (req, res) => {
    const {name, description, date} = req.body
    try {
        const AlreadyCreated = await Database.findOne("Election", {name: name})
        if (AlreadyCreated) {
            res.status(400).send({message: "Existing Election with same name"})
        } else {
            const result = await Database.InsertOne("Election", {
                _id: "vt" + bcrypt.hashSync(name, 10),
                name: name,
                description: description,
                candidates: [],
                date: date
            })
            res.send({message: "Election added successfully"})
        }
    } catch (error) {
        res.status(400).send({message: "Error adding election"})
    }
})
router.post('/removeElection', async (req, res) => {
    const {electionId} = req.body
    try {
        const result = await Database.DeleteOne("Election", {_id: electionId})
        res.send({message: "Election removed successfully"})
    } catch (error) {
        res.status(400).send({message: "Error removing election"})
    }
})
router.post('/updateElection', async (req, res) => {
    const {name, description, date, _id} = req.body
    try {
        const result = await Database.UpdateOne("Election", {_id: _id}, {
            $set: {
                name: name,
                description: description,
                date: date
            }
        }, true)
        res.send({message: "Election updated successfully"})
    } catch (error) {
        res.status(400).send({message: "Error updating election"})
    }
})

router.get('/getAllElections', async (req, res) => {
    try {
        const result = await Database.find("Election", {})
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send({message: "Error getting elections"})
    }
})

router.post('/getElections', async (req, res) => {
    try {
        const {userId} = req.body
        const AlreadyVotedElect = await Database.find("users", {_id: userId})
        let AlreadyVoted = []
        if (AlreadyVotedElect.length > 0) {
            AlreadyVoted = AlreadyVotedElect[0].Elections
        }
        const result = await Database.find("Election", {})
        const elections = []
        for (let election of result) {
            if (!AlreadyVoted.includes(election._id)) {
                elections.push(election)
            }
        }
        res.send(elections)
    } catch (error) {
        res.status(400).send({message: "Error getting elections"})
    }
})
router.post('/AssignCandidate', async (req, res) => {
    const {candidateId, electId} = req.body
    try {
        const AlreadyACandidate = await Database.findOne("Election", {_id: electId})
        const IsCandidate = await Database.findOne("users", {_id: candidateId})
        if (!IsCandidate) {
            res.status(400).json({message: "Candidate does not exist"})
        } else if (AlreadyACandidate.candidate !== null && AlreadyACandidate.candidates.includes(candidateId)) {
            res.status(400).send({message: "Candidate already added"})
        } else {
            let candidate = {
                _id: candidateId,
                votes: 0,
                votedBy: []
            }
            const result = await Database.findOneAndUpdate("Election", {_id: electId}, {$push: {candidates: candidate}})
            res.send({message: "Candidate added successfully"})
        }
    } catch (error) {
        res.status(400).send({message: "Error adding candidate"})
    }
})
router.post('/RemoveCandidate', async (req, res) => {
    const {candidateId, voteId} = req.body
    try {
        const AlreadyACandidate = await Database.findOne("Election", {_id: voteId})
        const IsCandidate = await Database.findOne("votes", {_id: candidateId})
        if (!IsCandidate) {
            res.status(400).send({message: "Candidate does not exist"})
        } else if (!AlreadyACandidate.candidates.includes(candidateId)) {
            res.status(400).send({message: "Candidate not added"})
        } else {
            const result = await Database.findOneAndUpdate("Election", {_id: voteId}, {$pull: {candidates: candidateId}})
            res.send({message: "Candidate removed successfully"})
        }
    } catch (error) {
        res.status(400).send({message: "Error removing candidate"})
    }
})
router.post('/RemoveElection', async (req, res) => {
    const {voteId} = req.body
    try {
        const result = await Database.findOneAndDelete("Election", {_id: voteId})
        res.send({message: "Election removed successfully"})
    } catch (error) {
        res.status(400).send({message: "Error removing election"})
    }
})


export default router