import React from "react"
import Form from 'react-bootstrap/Form';

export default function DropdownPl({items, playlistChanged}) {
    function displayTracks(event){
        const selectedPlaylist = event.target.value;
        playlistChanged(selectedPlaylist)
    }
  return (
    <Form.Group controlId="dropdown">
      <Form.Control as="select" onChange={displayTracks}>
      <option key="1">Choose Playlist</option>
      {items.map(item => 
        <option key={item.id} value={item.id}>{item.name}</option>
      )}
      </Form.Control>
    </Form.Group>
  );
}