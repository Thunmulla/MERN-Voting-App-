import {IsLoggedIn} from "../Authentication/Auth.jsx";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {HomeCardComponent} from "../component/CardComponent/HomeCardComponent.jsx";
import VoteNow from "../assets/Vote_Now.png"
import Election from "../assets/Election_Manage.png"

export function HomePage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate("/");
        }
    })
    const fun = () => {
        navigate("/election")
    }
    return (
        <div className="width">
            {/*<NavbarComponent/>*/}
            <div className="d-flex justify-content-evenly">
                <div className="d-flex flex-row">
                    <HomeCardComponent className="bg-gradient bg-success custom-card-success mx-5" description={""}
                                       color={"white"} name={"VoteNow"} click={fun}/>
                    <HomeCardComponent className="bg-danger custom-card-danger mx-5" description={""} color={"white"}
                                       border={"danger"} name={"Election"} click={fun}/>
                </div>
            </div>
        </div>
    );
}
