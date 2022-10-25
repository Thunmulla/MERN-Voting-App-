import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Col, FloatingLabel, Row} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [role, setRole] = useState("Voter");

    const Register = async () => {
        const PasswordMatch = password === confirmPassword;
        if (!username.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username is required!',
            })
        } else if (!email.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email is required!',
            })
        } else if (!firstName.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'First Name is required!',
            })
        } else if (!lastName.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Last Name is required!',
            })
        } else if (!password.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password is required!',
            })
        } else if (!confirmPassword.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Confirm Password is required!',
            })
        } else if (!PasswordMatch) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Password does not match!',
            })
        } else {
            await axios.post("http://localhost:5000/register", {
                firstname: firstName,
                lastname: lastName,
                username: username,
                password: password,
                email: email,
                role: role
            }).then((res) => {
                if (res.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registered Successfully! ',
                        text: 'Remember your credentials!',
                        showConfirmButton: true,
                        confirmButtonText: 'Login',
                        timer: 1500,
                        timerProgressBar: true,
                    }).then(() => {
                        navigate("/")
                    })
                }
            }).catch((err) => {
                if (err.response.data) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.response.data.message,
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                }
            })
        }
    }

    const HandleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        Register().then(r => {
            if (r.success) {
                navigate("/")
            }
        });
        setValidated(true);
    }


    const navigate = useNavigate();
    useEffect(() => {
        if (IsLoggedIn()) {
            navigate("/home");
        }
    })
    return (
        <div>
            <div className=" p-5 text-dark">
                <h1 className="py-2 text-white font-monospace">Register New User</h1>
                <div className="d-flex flex-column px-5 ">
                    <Form>
                        <FloatingLabel
                            controlId="floatingInputEmail"
                            label="Email Address"
                            className="mb-3"
                        >
                            <Form.Control required type="email" onChange={(e) => setEmail(e.target.value)}
                                          placeholder="Enter Email" value={email}/>
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </FloatingLabel>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputFirstName"
                                    label="First Name"
                                    className="mb-3"
                                >
                                    <Form.Control type="text" value={firstName}
                                                  onChange={(e) => setFirstName(e.target.value)}
                                                  placeholder="name@example.com"/>
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputLastName"
                                    label="Last Name"
                                    className="mb-3"
                                >
                                    <Form.Control type="text" value={lastName}
                                                  onChange={(e) => setLastName(e.target.value)}
                                                  placeholder="name@example.com"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputPassword"
                                    label="Password"
                                    className="mb-3"
                                >
                                    <Form.Control type="password" value={password}
                                                  onChange={(e) => setPassword(e.target.value)}
                                                  placeholder="name@example.com"/>
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputCPassword"
                                    label="Confirm Password"
                                    className="mb-3"
                                >
                                    <Form.Control type="password" value={confirmPassword}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                                  placeholder="name@example.com"/>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <Row className="g-2">
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingInputUserName"
                                    label="User Name"
                                    className="mb-3 "
                                >
                                    <Form.Control type="text" value={username}
                                                  onChange={(e) => setUsername(e.target.value)}
                                                  placeholder="name@example.com"/>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col md>
                                <FloatingLabel
                                    controlId="floatingSelectGrid"
                                    label="Select Role"
                                >
                                    <Form.Select aria-label="Floating label select example"
                                                 onChange={(e) => setRole(e.target.value)}>
                                        <option value="Voter">Voter</option>
                                        <option value="Candidate">Candidate</option>
                                        <option value="Manager">Manager</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                        </Row>
                        <div className="mt-4 d-grid gap-2">
                            <Button variant="success" onClick={Register} size="lg">Register</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}