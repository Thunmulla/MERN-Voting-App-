import {Button, Container, Navbar} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import logo from "../../assets/Logo.png";

const BaseUrl = "http://localhost:5000/logout"

export function NavbarAuthComponent() {
    const Register = window.location.pathname === "/register";
    let ButtonName;
    let NavigateTo;
    let ButtonColor;
    if (Register) {
        ButtonName = "Login";
        NavigateTo = "/";
        ButtonColor = "primary";
    } else {
        ButtonName = "Register";
        NavigateTo = "/register";
        ButtonColor = "success";
    }

    const Redirect = (path) => {
        navigate(path);
    }


    const navigate = useNavigate();
    const logout = () => {
        const user = localStorage.getItem('user')
        const id = JSON.parse(user).id
        axios({
            method: 'get',
            url: BaseUrl,
        }).then(res => {
            if (res.status === 200 && res.data.success) {
                localStorage.removeItem('user')
                if (localStorage.getItem('SelectedElection')) {
                    localStorage.removeItem('SelectedElection')
                }
                navigate('/')
            }
        })
    }
    return (
        <Navbar bg="dark" variant="light">
            <Container className={"justify-content-center"}>
                <Navbar.Brand href="/home">
                    <img
                        alt=""
                        src={logo}
                        height="50"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
            </Container>
            <Button hidden={IsLoggedIn()} className="mx-3 px-3" variant={ButtonColor} size="lg"
                    onClick={() => Redirect(NavigateTo)}>{ButtonName}</Button>
        </Navbar>
    )
}