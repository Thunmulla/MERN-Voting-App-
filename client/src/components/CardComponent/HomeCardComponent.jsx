import {Card} from "react-bootstrap";
import React from "react";

export function HomeCardComponent(props) {
    return (
        <Card className={props.className} style={{
            width: '18rem',
            height: '10rem',
            borderWidth: '4px',
            background: props.color ? props.color : 'darkred',
            color: 'white',
            cursor: props.click ? "pointer" : ""
        }} border={props.border ? props.border : "success"} onClick={props.click}>
            <Card.Body>
                {props.name ? <Card.Title><h2>{props.name}</h2></Card.Title> : ""}
                {props.description ? <Card.Text>{props.description}</Card.Text> : ""}
            </Card.Body>
        </Card>
    )
}