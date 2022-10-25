import {NavbarComponent} from "./Navbar.jsx";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import {NavbarAuthComponent} from "./NavbarAuth.jsx";


export function Header() {
    let isLoggedIn = IsLoggedIn();
    if (isLoggedIn) {
        return (
            <div className="header">
                <NavbarComponent/>
            </div>
        )
    } else {
        return (
            <div className="header">
                <NavbarAuthComponent/>
            </div>
        )
    }


}