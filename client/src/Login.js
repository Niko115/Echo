import React from "react"
import { Container } from "react-bootstrap"

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=6fc89f55a5194de4bdea50702f48bad9&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-top-read%20user-read-private%20user-library-read%20user-library-modify%20playlist-modify-public%20playlist-read-private%20playlist-read-collaborative%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state"

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
