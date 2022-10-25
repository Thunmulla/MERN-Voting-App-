import router from "../index.js";
import {Database} from "../../db/connect.js";

router.post("/getVote", async (req, res) => {
    const {id} = req.body;
    const user = await Database.findOne("users", {_id: id});
    if (user) {
        res.status(200).json({vote: user.votes});
    } else {
        res.status(404).json({message: "User not found"});
    }
});
router.post('/addVote', async (req, res) => {
    const {candidateId, ElectionId, VoterId} = req.body
    console.log(VoterId)
    try {
        const result = await Database.UpdateOne("users", {_id: VoterId}, {$push: {Elections: ElectionId}})
        // const result=await Database.findOne("users",{_id:VoterId})
        console.log(result)
        const result2 = await Database.UpdateOne("users", {_id: candidateId}, {$inc: {votes: 1}})
        res.status(200).send({message: "Vote Added", success: true})
    } catch (error) {
        console.log(error)
        res.status(400).send({message: "Error voting"})
    }
});
router.post('/deleteVote', async (req, res) => {
    const {voteId, candidateId} = req.body
    try {
        const AlreadyVoted = await Database.findOne("users", {_id: req.user._id})
        if (!AlreadyVoted.voted) {
            res.send({message: "You have not voted"})
        } else {
            const result = await Database.findOneAndUpdate("users", {_id: req.user._id}, {$set: {voted: false}})
            const result2 = await Database.findOne("Election", {_id: voteId})
            for (let candidate of result2.candidates) {
                if (candidate._id === candidateId) {
                    console.log(candidate)
                    candidate.votes -= 1
                    if (candidate.votedBy) {
                        delete candidate.votedBy[candidate.votedBy.indexOf(req.user._id)]
                    } else {
                        res.send({message: "You have not voted"})
                    }
                    break
                }
            }
            console.log(result2.candidates)
            const result3 = await Database.findOneAndUpdate("Election", {_id: voteId}, {$set: {candidates: result2.candidates}})
            res.send({message: "You have voted successfully"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({message: "Error voting"})
    }
})
router.post('/updateVote', async (req, res) => {
    const {voteId, candidateId, NewCandidateId} = req.body
    try {
        const AlreadyVoted = await Database.findOne("users", {_id: req.user._id})
        if (!AlreadyVoted.voted) {
            res.send({message: "You have not voted"})
        } else {
            const result = await Database.findOne("Election", {_id: voteId})
            for (let candidate of result.candidates) {
                if (candidate._id === candidateId) {
                    console.log(candidate)
                    candidate.votes -= 1
                    if (candidate.votedBy) {
                        delete candidate.votedBy[candidate.votedBy.indexOf(req.user._id)]
                    } else {
                        res.send({message: "You have not voted"})
                    }
                    break
                }
            }
            for (let candidate of result.candidates) {
                if (candidate._id === NewCandidateId) {
                    console.log(candidate)
                    candidate.votes += 1
                    if (candidate.votedBy) {
                        candidate.votedBy.push(req.user._id)
                    } else {
                        candidate.votedBy = [req.user._id]
                    }
                    break
                }
            }
            console.log(result.candidates)
            const result3 = await Database.findOneAndUpdate("Election", {_id: voteId}, {$set: {candidates: result.candidates}})
            res.send({message: "You have voted successfully"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({message: "Error voting"})
    }

})


export default router

