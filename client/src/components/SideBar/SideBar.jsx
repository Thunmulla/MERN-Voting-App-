import {MDBContainer} from "mdb-react-ui-kit";
import {IsLoggedIn} from "../../Authentication/Auth.jsx";
import {Button} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export function SideBar() {
    const navigate = useNavigate();
    const RestrictedPage = ["/", "/register"];
    const [NoOfVotes, setNoOfVotes] = useState(0);
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : "";
    let Role = "";
    let UserName = "";
    if (user) {
        Role = user.role;
        UserName = user.username;
    }

    const getVotes = async () => {
        if(Role==="Candidate") {
            await axios({
                method: 'post',
                url: "http://localhost:5000/vote/getVote",
                data: {
                    id: user.id
                },
                withCredentials: true,
            }).then((res) => {
                setNoOfVotes(res.data.vote);
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    getVotes();
    setInterval(getVotes, 10000);

    const IsInLoggingPage = RestrictedPage.includes(window.location.pathname);
    const logout = () => {
        const user = sessionStorage.getItem('user')
        const id = JSON.parse(user).id
        let BaseUrl = "http://localhost:5000/logout";
        axios({
            method: 'get',
            url: BaseUrl,
        }).then(res => {
            console.log(res.data)
            if (res.status === 200 && res.data.success) {
                sessionStorage.removeItem('user')
                if (sessionStorage.getItem('SelectedElection')) {
                    sessionStorage.removeItem('SelectedElection')
                }
                navigate('/')
                window.location.reload();
            }
        })
    }
    if (!IsInLoggingPage) {
        return (
            <div className="sidebar d-flex justify-content-center align-items-center text-white">
                <div className="sidebar__body">
                    <ul>
                        <li>
                            <MDBContainer className="my-4 d-flex justify-content-center">
                                <img
                                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                                    className="rounded-circle"
                                    alt="Avatar"
                                    height={120}
                                />
                            </MDBContainer>
                        </li>
                        <li>
                            <h5>{UserName}</h5>
                        </li>
                        <li>
                            <h6>{Role}</h6>
                        </li>

                        <li>
                            <Button hidden={!IsLoggedIn()} size="lg" variant="danger" onClick={logout}>Log
                                Out</Button>
                        </li>
                        <div hidden={user.role !== "Candidate"}>
                            <div className={"mt-5"}></div>
                            <li className={"p-3 border border-3 border-warning"}>
                                Votes : <h1 className={"text-info"}>{NoOfVotes}</h1>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        )
    }

}

