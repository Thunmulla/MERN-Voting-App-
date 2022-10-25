import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FloatingLabel, Row} from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

export function EditElection() {
    const [electionName, setElectionName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [id, setId] = useState("");


    const EditElection = async () => {
        if (electionName.trim() === "" || description.trim() === "" || date.trim() === "") {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
        } else if (new Date(date) < new Date()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid date!',
            })
        } else {
            await axios.post("http://localhost:5000/election/updateElection", {
                name: electionName,
                description: description,
                date: date,
                _id: id,
            }).then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
                        sessionStorage.removeItem("SelectedElection");
                        navigate("/election/manage-elect");
                    })
                }
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message,
                })
            })
        }
    }
    const navigate = useNavigate();
    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate("/");
        }
        if (sessionStorage.getItem("SelectedElection")) {
            const election = JSON.parse(sessionStorage.getItem("SelectedElection"));
            setElectionName(election.name);
            setDescription(election.description);
            setDate(election.date);
            setId(election._id);
        } else {
            navigate("/election/manage-elect");
        }

        //Clear Session when component unmount
        const unloadCallback = (event) => {
            event.preventDefault();
            event.returnValue = "";
            return "";
        };
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("unload", unloadCallback)

    }, []);


    function ResetElection() {
        if (sessionStorage.getItem("SelectedElection")) {
            const election = JSON.parse(sessionStorage.getItem("SelectedElection"));
            navigate("/election/manage-elect");
            window.location.reload();
        }
    }

    return (
        <div>
            <div className="border border-4 p-5 border-danger bg-gradient bg-primary bg-opacity-25">
                <h1 className="py-2">Edit Election</h1>
                <div className="d-flex flex-column px-5 ">
                    <Form>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputElectionName"
                                    label="Election Name"
                                    className="mb-3 "
                                >
                                    <Form.Control type="text" value={electionName}
                                                  onChange={(e) => setElectionName(e.target.value)}
                                                  placeholder="name@example.com"/>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputDate"
                                    label="Date"
                                    className="mb-3 "
                                >
                                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                                  placeholder="Date"/>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a Date.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <FloatingLabel
                                controlId="floatingInputEmail"
                                label="Description"
                                className="mb-3"
                            >
                                <Form.Control style={{height: '100px'}} as="textarea" rows={7} value={description}
                                              onChange={(e) => setDescription(e.target.value)}/>
                            </FloatingLabel>
                        </Form.Group>

                        <div className="mt-4 d-grid gap-2">
                            <Row xs={2} md={2} className="g-1">
                                <Col><Button variant="primary" className={"w-100"} onClick={EditElection}
                                             size="lg">Edit</Button></Col>
                                <Col><Button variant="danger" className={"w-100"} onClick={ResetElection}
                                             size="lg">Cancel</Button></Col>
                            </Row>

                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}