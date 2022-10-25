import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FloatingLabel, Row} from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

export function AddElection() {
    const [electionName, setElectionName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const AddElection = async () => {
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
            await axios.post("http://localhost:5000/election/addElection", {
                name: electionName,
                description: description,
                date: date,
            }).then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: response.data.message,
                        timer: 2000,
                        timerProgressBar: true,
                    }).then(() => {
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
    })
    return (
        <div>
            <div className=" p-5 ">
                <h1 className="py-2">Add New Election</h1>
                <div className="d-flex flex-column px-5 ">
                    <Form className={"text-dark"}>
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
                            <Button variant="primary" onClick={AddElection} size="lg">Add</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );

}