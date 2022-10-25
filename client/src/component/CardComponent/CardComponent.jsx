import {Button, Card} from "react-bootstrap";
import election from "../../assets/election.png";
import React from "react";

function CardComponent(props) {

    return (
        <Card className={"bg-dark"} style={{width: '18rem'}} key={props.index}>
            <Card.Img variant="top" src={election}/>
            <Card.Body>
                <Card.Title>{props.item.name}</Card.Title>
                <Card.Text>
                    {props.item.description}
                </Card.Text>
                <Button variant="primary" onClick={() => props.SelectElection(props.item._id)}>View Candidates</Button>
            </Card.Body>
        </Card>
    )


}

export default CardComponent;

