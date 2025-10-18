import React from "react"
import Card from 'react-bootstrap/Card';

export default function Playlist({list, chooseTrack}) {
  function handlePlay() {
    chooseTrack(list)
  }

  return (
    <Card key={list.uri} border="secondary" style={{ height: '22rem', width: '13rem', cursor: "pointer" }} onClick={handlePlay}>
      <Card.Img variant="top" src={list.albumUrl} />
      <Card.Body>
        <Card.Title className="fs-6">{list.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{list.artist}</Card.Subtitle>
      </Card.Body>
    </Card>
  )
}
