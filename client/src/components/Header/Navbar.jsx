import {Container, Nav, Navbar} from "react-bootstrap";
import {IsLoggedIn, IsManager} from "../../Authentication/Auth.jsx";
import logo from "../../assets/LogoBg.png";
export function NavbarComponent() {
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/home">
                    <img
                        alt=""
                        src={logo}
                        height="50"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Brand href="/home">SimplyVoting</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/home">Home</Nav.Link>
                    {/*<Nav.Link href="/vote">Vote Now</Nav.Link>*/}
                    <Nav.Link href="/election">Elections</Nav.Link>
                    <Nav.Link hidden={!IsManager()} href="/election/manage-elect">Manage Elections</Nav.Link>
                    <Nav.Link href="/contactus">Contact Us</Nav.Link>
                    <Nav.Link hidden={IsLoggedIn()} href="/register">Register</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}