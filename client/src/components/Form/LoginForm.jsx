import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import Swal from "sweetalert2";

const BaseUrl = "http://localhost:5000/login";

export function LoginForm() {
    const navigate = useNavigate();
    useEffect(() => {
        if (IsLoggedIn()) {
            navigate("/home");
        }
    });
    const [username, setUserName] = useState('admin');
    const [password, setPassword] = useState('pass');

    const onChangeUserName = (e) => {
        setUserName(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const onSubmit = async (e) => {
        await axios({
            method: 'post',
            url: BaseUrl,
            withCredentials: true,
            data: {
                username: username,
                password: password
            }
        }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                sessionStorage.setItem('user', JSON.stringify({
                    username: res.data.user.username,
                    id: res.data.user._id,
                    email: res.data.user.email,
                    voted: res.data.user.voted,
                    role: res.data.user.role
                }));
                navigate("/home");
                window.location.reload();
            }
        }).catch((err) => {
            if (err.response.status === 401 && err.response.data.message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Logging Error!',
                    text: err.response.data.message,
                    confirmButtonText: 'Try Again!',
                    showCancelButton: true,
                    cancelButtonText: 'Create New Account',
                    cancelButtonColor: '#32ac02',
                    timer: 10000,
                    timerProgressBar: true,
                    backdrop: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/');
                    } else if (result.isDismissed) {
                        navigate('/register');
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Logging Error!',
                    text: 'Something went wrong!',
                    confirmButtonText: 'Try Again!',
                    timer: 2000,
                    timerProgressBar: true,
                })
            }
        })
    };
    return (
        <div className={"login"}>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter User Name" onChange={onChangeUserName}
                                  value={username}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={onChangePassword} value={password}/>
                </Form.Group>
                <div className="d-grid gap-2">
                    <Button variant="primary" onClick={onSubmit} size="lg">
                        Log In
                    </Button>
                </div>
            </Form>
        </div>
    );
}

