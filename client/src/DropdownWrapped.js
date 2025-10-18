import React from "react"
import Form from 'react-bootstrap/Form';


export default function DropdownWrapped({timeChanged}) {
    function changeTime(event){
        const selectedOption = event.target.options[event.target.selectedIndex];
        const selectedTime = selectedOption.id;
        timeChanged(selectedTime);
    }
  return (
    <Form.Group controlId="dropdown">
      <Form.Control as="select" className="bg-dark text-light" onChange={changeTime}>
      <option id="1">Last 4 weeks</option>
      <option id="2">Last 6 months</option>
      <option id="3">Last year</option>
      </Form.Control>
    </Form.Group>
  );
}