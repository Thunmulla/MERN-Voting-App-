import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IsLoggedIn} from "../Authentication/Auth.jsx";
import {Button, Card, Col, Row} from "react-bootstrap";
import election from "../assets/election.png";
import NoCand from "../assets/NoCand.png";
import axios from "axios";
import Swal from 'sweetalert2'


export function VotePage() {
    const IsElectionSelected = !!sessionStorage.getItem("SelectedElection");
    const userId = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")).id : "";
    const VotedUser = sessionStorage.getItem("SelectedElection") ? JSON.parse(sessionStorage.getItem("SelectedElection")).candidates : [];

    let AlreadyVoted = false;
    if (VotedUser) {
        if (VotedUser.includes(userId)) {
            AlreadyVoted = true;
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (!IsLoggedIn()) {
            Swal.fire({
                title: 'You have to Login first',
                icon: 'error',
                confirmButtonText: 'Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/")
                }
            })
        }
        if (AlreadyVoted) {
            Swal.fire({
                title: 'You have already voted!',
                text: 'Redirecting to Home Page....',
                icon: 'error',
                confirmButtonText: 'Ok',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                timer: 2000,
                timerProgressBar: true,
            })
            navigate("/home")
        } else if (!IsElectionSelected) {
            Swal.fire({
                title: 'You have to select an election first',
                text: 'Redirecting to Election Page....',
                icon: 'error',
                confirmButtonText: 'Ok',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                timer: 1500,
                timerProgressBar: true,
            }).then((result) => {
                if (result.isDismissed) {
                    navigate("/election")
                }
            })
        }

    }, [])

    let VoteUsed = false;
    const MakeVote = (id) => {
        const CandidateId = id
        const ElectionId = JSON.parse(sessionStorage.getItem("SelectedElection"))._id
        const VoterId = JSON.parse(sessionStorage.getItem("user")).id
        const data = {
            candidateId: CandidateId,
            ElectionId: ElectionId,
            VoterId: VoterId
        }
        axios({
            method: "POST",
            url: "http://localhost:5000/vote/addVote",
            withCredentials: true,
            data: data
        }).then((res) => {
            if (res.data.success) {
                sessionStorage.removeItem("SelectedElection")
                sessionStorage.setItem("user", JSON.stringify({
                    username: JSON.parse(sessionStorage.getItem("user")).username,
                    id: JSON.parse(sessionStorage.getItem("user")).id,
                    email: JSON.parse(sessionStorage.getItem("user")).email,
                    voted: true
                }))
                Swal.fire({
                    title: 'Vote Successful!',
                    text: 'You have successfully voted',
                    icon: 'success',
                    confirmButtonText: 'Home'
                })
                navigate("/home")
            }
        })
    }

    if (!AlreadyVoted && IsElectionSelected) {
        const SelectedElection = JSON.parse(sessionStorage.getItem("SelectedElection")) || null;
        if (!SelectedElection) {
            Swal.fire({
                title: 'No Election Selected!',
                text: 'Please select an election to vote',
                icon: 'error',
                customClass: 'swal-fullscreen',
                confirmButtonText: 'View Election',
                showCancelButton: true,
                cancelButtonText: 'Home'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/election")
                } else if (result.isDismissed) {
                    navigate("/home")
                }
            })

        }
        const [CandidateInfo, setCandidateInfo] = useState([])
        const [Candidate, setCandidate] = useState([SelectedElection ? SelectedElection.candidates : []]);
        const GetCandidateInfo = async () => {

            await axios({
                method: "POST",
                url: "http://localhost:5000/candidate/getCandidateInElection",
                withCredentials: true,
                data: {
                    electionId: SelectedElection._id
                }
            }).then((res) => {
                if (res.data.Candidates) {
                    setCandidateInfo(prev => [...res.data.Candidates])
                }
            })
        }
        useEffect(() => {
            GetCandidateInfo().then(r => {

            })

        }, [])
        return (
            <div>
                <h1>Vote Page</h1>
                <Row xs={3} md={3} className="g-4 d-flex">
                    {CandidateInfo.length !== 0 ? CandidateInfo.map((item, index) => (
                        <Col key={item._id} className={"mx-2"} style={{width: '18rem'}}>
                            <Card className={"bg-dark"} style={{width: '18rem'}} key={index}>
                                <Card.Img variant="top" src={election}/>
                                <Card.Body>
                                    <Card.Title>{item.firstname}</Card.Title>
                                    <Card.Text>
                                        {item.lastname}
                                    </Card.Text>
                                    <div className="d-grid gap-2">
                                        <Button hidden={AlreadyVoted} variant="success"
                                                onClick={() => MakeVote(item._id)}>{"Vote"}</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : <Card className={"bg-dark d-flex flex-column"} style={{width: '18rem'}}>
                        <Card.Img variant="top" src={NoCand}/>
                        <Card.Body>
                            <Card.Title>No Candidate Found !</Card.Title>
                        </Card.Body>
                    </Card>}
                </Row>
            </div>
        );
    }
}