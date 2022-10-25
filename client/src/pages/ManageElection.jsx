import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, FloatingLabel, Form, Modal, Row} from "react-bootstrap";
import election from "../assets/election.png";
import Candidate from "../assets/Candidate.png";
import Swal from "sweetalert2";


export function ManageElection() {

    const navigator = useNavigate();

    const [showRemoveCandidate, setShowRemoveCandidate] = useState(false);
    ;
    const handleAddElectionClose = () => setShowRemoveCandidate(false);
    const handleAddCandidateClose = () => setShowAddCandidate(false);
    const handleRemoveCandidateShow = () => setShowRemoveCandidate(true);
    const handleAddCandidateShow = () => setShowAddCandidate(true);

    const [Elections, setElections] = useState({});
    const [candidate, setCandidates] = useState({});
    const [candidateName, setCandidatesName] = useState({});
    const [ElectionCandidates, setElectionCandidates] = useState([]);
    const [SelectedElection, setSelectedElection] = useState("");
    const [toAssignCandidate, setAssignCandidate] = useState("");

    const [showAddCandidate, setShowAddCandidate] = useState(false);
    // setElections(elect=>({...elect, ...updatedElection}))
    useEffect(() => {
        axios.get("http://localhost:5000/getAllElections").then((res) => {
            if (res.status === 200 && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    setElections(r => ({...r, [res.data[i].name]: res.data[i]}))
                }
            }
        }).catch((err) => {

        })
        axios.get("http://localhost:5000/getAllElections").then((res) => {
            if (res.status === 200 && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    setElections(r => ({...r, [res.data[i].name]: res.data[i]}))
                }
            }
        }).catch((err) => {

        })

        axios.get("http://localhost:5000/getAllCandidates").then((res) => {

            if (res.status === 200 && res.data) {
                if (res.data.result.length > 0) {
                    for (let i = 0; i < res.data.result.length; i++) {
                        setCandidates(r => ({...r, [res.data.result[i].username]: res.data.result[i]}))
                    }
                }
            }
        })
    }, [])

    const SelectElection = (e) => {
        setSelectedElection(e.target.value);
    }

    const RenderElections = () => {
        let ElectionsNames = {};
        const ElectionsNamesArray = Object.keys(Elections);
        for (let i = 0; i < ElectionsNamesArray.length; i++) {
            ElectionsNames[ElectionsNamesArray[i]] = ElectionsNamesArray[i];
        }
        return ElectionsNames;
    }

    const RemoveElection = async () => {
        const ElectionsNames = RenderElections();
        const ElectionsNamesArray = Object.keys(Elections);
        const result = await Swal.fire({
            title: 'Delete Election',
            text: "Pick the Election you want to Remove",
            input: 'select',
            inputOptions: ElectionsNames,
            inputPlaceholder: 'Select an Election',
            confirmButtonText: 'Remove',
            confirmButtonColor: '#d33',
            showCancelButton: true,
            cancelButtonColor: '#3085d6',
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (ElectionsNamesArray.includes(value)) {
                        resolve()
                    } else {
                        resolve('You need to select an Election')
                    }
                })
            },
            backdrop: false
        })
        if (result.isConfirmed) {
            await axios.post("http://localhost:5000/election/removeElection", {
                electionId: Elections[result.value]._id
            }).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: res.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        navigator("/election/manage-elect");
                        window.location.reload();
                    })
                }
            }).catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.message,
                })
            })
            navigator('/election/manage-elect');
        }
    }
    const EditElection = async () => {
        const ElectionsNames = RenderElections();
        const ElectionsNamesArray = Object.keys(Elections);
        const result = await Swal.fire({
            title: 'Edit Election',
            text: "Pick the Election you want to Edit",
            input: 'select',
            inputOptions: ElectionsNames,
            inputPlaceholder: 'Select an Election',
            confirmButtonText: 'Edit',
            confirmButtonColor: '#05ba08',
            showCancelButton: true,
            cancelButtonColor: '#d6304e',
            background: '#76cfe1',
            color: '#000000',

            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (ElectionsNamesArray.includes(value)) {
                        resolve()
                    } else {
                        resolve('You need to select an Election')
                    }
                })
            },
            backdrop: false
        })
        if (result.isConfirmed) {
            sessionStorage.setItem('SelectedElection', JSON.stringify(Elections[result.value]));
            navigator('/election/edit-elect');
        }
    }

    function AddCandidate() {
        handleAddCandidateShow();

    }

    let CandidateList = [];
    for (let i = 0; i < Object.keys(candidate).length; i++) {
        CandidateList.push(candidate[Object.keys(candidate)[i]]);
    }
    const SelectedCandidate = (e) => {
        setAssignCandidate(e.target.value);
        const ToAdd = FilterElection(candidate[e.target.value]._id);
        setElectionCandidates(ToAdd);
    }

    const FilterElection = (rm) => {
        let ElectionList = [];
        for (let i = 0; i < Object.keys(Elections).length; i++) {
            let flag = false;
            if (Elections[Object.keys(Elections)[i]].candidates) {
                for (let j = 0; j < Elections[Object.keys(Elections)[i]].candidates.length; j++) {
                    if (Elections[Object.keys(Elections)[i]].candidates[j]._id === rm) {
                        flag = true;
                        break;
                    }
                }
            }
            if (!flag) {
                ElectionList.push(Elections[Object.keys(Elections)[i]]);
            }
        }
        return ElectionList;
    }

    function SelectCandidate(e) {
        console.log(CandidateElections)
    }

    function AssignCandidate() {
        const Elect = Elections[SelectedElection]
        const candidate = CandidateList.filter((e) => e.username === toAssignCandidate)[0]
        axios.post("http://localhost:5000/election/AssignCandidate", {
            electId: Elect._id,
            candidateId: candidate._id
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Candidate Assigned Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                handleAddCandidateClose();
                window.location.reload();
            }
        }).catch((err) => {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
        })
    }


    return (
        <div className={"d-flex flex-column"}>
            <Modal show={showAddCandidate} onHide={handleAddCandidateClose}>
                <Modal.Header closeButton className="text-center">
                    <Modal.Title>Assign Candidate to Election</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Col className="g-2">
                            <Row className="mt-2">
                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Works with selects"
                                >
                                    <Form.Select aria-label="Floating label select example"
                                                 onClick={SelectedCandidate}>
                                        {CandidateList.map((candidate) => {
                                            return <option key={candidate._id} className={"bg-dark text-white"}
                                                           value={candidate.value}>{candidate.username}</option>
                                        })}
                                    </Form.Select>
                                </FloatingLabel>
                            </Row>
                            <Row className="mt-2">
                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Works with selects"
                                >
                                    <Form.Select aria-label="Floating label select example" onClick={SelectElection}
                                                 disabled={ElectionCandidates.length < 1}>
                                        {ElectionCandidates.map((election) => {
                                            return <option key={election._id}
                                                           value={election.value}>{election.name}</option>
                                        })}
                                    </Form.Select>
                                </FloatingLabel>
                            </Row>
                        </Col>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddCandidateClose}>
                        Close
                    </Button>
                    <Button variant="primary" disabled={SelectedElection.trim() === ""} onClick={AssignCandidate}>
                        Add Candidate
                    </Button>
                </Modal.Footer>
            </Modal>
            <h3 className={"mt-1 p-2 text-white"}>Manage Election</h3>
            <Row xs={3} md={3} className="g-4 ">
                <Col>
                    <Card className={"bg-dark text-white"} style={{width: '18rem'}}>
                        <Card.Img variant="top" src={election}/>
                        {/*<Card.Body>*/}
                        <Button className={"mt-3"} variant="outline-success"
                                onClick={() => navigator("/election/add-elect")}>Add Election</Button>
                        {/*</Card.Body>*/}
                    </Card>
                </Col>
                <Col>
                    <Card className={"bg-dark text-white"} style={{width: '18rem'}}>
                        <Card.Img variant="top" src={election}/>
                        {/*<Card.Body>*/}
                        <Button className={"mt-3"} variant="outline-primary" onClick={EditElection}>Edit
                            Election</Button>
                        {/*</Card.Body>*/}
                    </Card>
                </Col>
                <Col>
                    <Card className={"bg-dark text-white"} style={{width: '18rem'}}>
                        <Card.Img variant="top" src={election}/>
                        {/*<Card.Body>*/}
                        <Button className={"mt-3"} variant="outline-danger" onClick={RemoveElection}>Remove
                            Election</Button>
                        {/*</Card.Body>*/}
                    </Card>
                </Col>
            </Row>
            <h3 className={"mt-2 p-2 text-white"}>Manage Candidate</h3>
            <div className={"d-flex justify-content-center"}>
                <Card className={"bg-dark"} style={{width: '18rem'}}>
                    <Card.Img variant="top" src={Candidate}/>
                    {/*<Card.Body>*/}
                    <Button className={"mt-3"} variant="outline-success" onClick={AddCandidate}>Assign
                        Candidate</Button>
                    {/*</Card.Body>*/}
                </Card>
            </div>


        </div>
    )
}