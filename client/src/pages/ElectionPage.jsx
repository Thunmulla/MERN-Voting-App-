import {IsLoggedIn} from "../Authentication/Auth.jsx";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Row} from "react-bootstrap";
import election from "../assets/election.png";
import CardComponent from "../component/CardComponent/CardComponent.jsx";


export function ElectionPage() {
    const navigate = useNavigate();
    const [Election, setElections] = useState([]);
    const [user, setUser] = useState({});

    const GetElection = async () => {
        const res = await axios({
            method: "POST",
            url: "http://localhost:5000/election/getElections",
            withCredentials: true,
            data: {
                userId: JSON.parse(sessionStorage.getItem("user")).id
            }
        })
        if (res) {
            setElections(prev => {
                if (prev.length === 0) {
                    return [...res.data]
                }
                if (prev.length > 0) {
                    return [...res.data]
                }
            })
        }

    }


    const SelectElection = (id) => {
        const SelectedElection = Election.filter((ele) => {
            return ele._id === id
        })
        sessionStorage.setItem("SelectedElection", JSON.stringify(SelectedElection[0]))
        navigate("/election/vote")
    }
    useEffect(() => {
        if (!IsLoggedIn()) {
            navigate("/");
        }
        GetElection()
        const users = JSON.parse(sessionStorage.getItem("user"));
        setUser(users);

    }, [])

    const NavigateToCreateElection = () => {
        navigate("/election/add-elect")
    }

    return (
        <div>
            <h1>Election Page</h1>
            <Row xs={3} md={3} className="g-4 d-flex">
                {Election.length !== 0 ? Election.map((item, index) => (
                    <Col key={index} className={"mx-2"} style={{width: '18rem'}}>
                        <CardComponent
                            item={item}
                            index={index}
                            name={item.name}
                            description={item.description}
                            SelectElection={SelectElection}/>
                    </Col>
                )) : <Card className={"bg-dark d-flex flex-column"} style={{width: '18rem'}}>
                    <Card.Img variant="top" src={election}/>
                    <Card.Body>
                        <Card.Title>No Election Found !</Card.Title>
                    </Card.Body>
                    <Card.Footer>
                        <Button hidden={user.role !== "Manager"} variant="success" onClick={NavigateToCreateElection}>Create
                            Election</Button>
                    </Card.Footer>
                </Card>}
            </Row>
        </div>
    )
}