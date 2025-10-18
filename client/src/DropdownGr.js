import React from "react"
import Form from 'react-bootstrap/Form';


export default function DropdownGr({items, genreChanged}) {
    function changeGenre(event){
        const selectedGenre = event.target.value;
        genreChanged(selectedGenre)
    }
  return (
    <Form.Group controlId="dropdown">
      <Form.Control as="select" onChange={changeGenre}>
      <option>Choose Genre</option>
      {items.map(item => 
        <option key={item.id} value={item.name}>{item.name}</option>
      )}
      </Form.Control>
    </Form.Group>
  );
}