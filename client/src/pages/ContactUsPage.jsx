import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IsLoggedIn} from "../Authentication/Auth.jsx";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {FloatingLabel} from "react-bootstrap";
import Swal from "sweetalert2";

export function ContactUsPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate("/");
        }
    })
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const IsEmailValid = (txt) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt);
    }
    const ContactUs = () => {
        if (email.trim() === "" || description.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all the fields!',
            })
        } else if (!IsEmailValid(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid email!',
            })
        } else {
            Swal.fire({
                title: 'Thank you for contacting us!',
                text: 'We will get back to you as soon as possible.',
                icon: 'success',
                confirmButtonText: 'OK',
                backdrop: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/home");
                }
            })
        }

    }
    return (
        <div>
            <h1 className="py-2">Contact Us Page</h1>
            <div className="d-flex flex-column text-dark w-100">
                <Form>


                    <FloatingLabel
                        controlId="floatingInput"
                        label="Your Email"
                        className="mb-3"
                    >
                        <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} as="textarea"
                                      placeholder="name@example.com"/>
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingTextarea2" label="Comments">
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{height: '300px'}}
                        />
                    </FloatingLabel>
                    <div className="mt-4 d-grid gap-2">
                        <Button variant="primary" onClick={ContactUs} size="lg">Submit</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}