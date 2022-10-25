import {LoginForm} from "../component/Form/LoginForm.jsx";
import {useEffect} from "react";
import {IsLoggedIn} from "../Authentication/Auth.jsx";
import {useNavigate} from "react-router-dom";

export function LoginPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (IsLoggedIn()) {
            navigate("/home");
        }
    })
    return (
        <div>
            <h1>Login Page</h1>
            <LoginForm/>
        </div>
    );
}