import React from "react";
import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form, Navbar, Row, Col } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import DropdownGr from "./DropdownGr";
import DropdownPl from "./DropdownPl";
import Playlist from "./Playlist";
import logo from "./logo.svg";
import TopItems from "./TopItems";
import DropdownWrapped from "./DropdownWrapped";

const spotifyApi = new SpotifyWebApi({
  clientId: "6fc89f55a5194de4bdea50702f48bad9",
});

console.log("Cherry-pick");

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState([]);
  const [genres, setGenres] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [time, setTime] = useState("short_term");

  function chooseTrack(track) {
    console.log(track);
    setPlayingTrack(track);
    setSearch("");
  }

  function loadFeaturedPlaylist() {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);

    setGenres([]);
    setPlaylists([]);
    setSearch("");
    setSelectedPlaylist([]);

    spotifyApi
      .getCategories({
        limit: 15,
        offset: 2,
        locale: "en-US",
      })
      .then((res) => {
        const genreItems = res.body.categories.items.map((item) => ({
          name: item.name === "Hip-Hop" ? "Hiphop" : item.name,
          id: item.id,
        }));
        setGenres(genreItems);
      })
      .catch((err) => console.error("Error reloading genres:", err));

    spotifyApi
      .searchPlaylists("popular", { limit: 1 })
      .then((res) => {
        if (!res.body.playlists.items.length) return;
        const featured = res.body.playlists.items[0];
        console.log("Loaded featured (by search):", featured.name);

        spotifyApi.getPlaylist(featured.id).then((res) => {
          setSelectedPlaylist(
            res.body.tracks.items.slice(0, 40).map((list) => ({
              artist: list.track.artists[0].name,
              title: list.track.name,
              uri: list.track.uri,
              albumUrl: list.track.album.images[0]?.url,
            }))
          );
        });
      })
      .catch((err) => console.error("Error loading featured playlist:", err));
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    loadFeaturedPlaylist();
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      console.log(res.body.tracks.items);
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getCategories({
        limit: 15,
        offset: 2,
        locale: "en-US",
      })
      .then((res) => {
        setGenres(
          res.body.categories.items.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          })
        );
        setGenres((genres) =>
          genres.map((item) => {
            if (item.name === "Hip-Hop") {
              return {
                ...item,
                name: "Hiphop",
              };
            }
            return item;
          })
        );
      });
  }, [accessToken]);

  function timeChanged(id) {
    console.log(id);
    if (id === "1") {
      setTime("short_term");
    } else if (id === "2") {
      setTime("medium_term");
    } else if (id === "3") {
      setTime("long_term");
    }
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMyTopTracks({
        time_range: time,
        limit: 5,
      })
      .then((res) => {
        console.log(res);
        setTopTracks(
          res.body.items.map((item) => {
            return {
              name: item.name,
              albumImg: item.album.images[2].url,
              id: item.id,
              uri: item.uri,
            };
          })
        );
      });
  }, [accessToken, time]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .getMyTopArtists({
        time_range: time,
        limit: 5,
      })
      .then((res) => {
        console.log(res);
        setTopArtists(
          res.body.items.map((item) => {
            return {
              name: item.name,
              albumImg: item.images[2].url,
              id: item.id,
            };
          })
        );
      });
  }, [accessToken, time]);

  function genreChanged(name) {
    console.log(name);
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
      .searchPlaylists(name.toLowerCase(), {
        limit: 20,
      })
      .then((res) => {
        console.log(res);
        if (res.body.playlists && Array.isArray(res.body.playlists.items)) {
          const filteredItems = res.body.playlists.items.filter(
            (item) => item !== null
          );

          setPlaylists(
            filteredItems.map((item) => ({
              name: item.name,
              id: item.id,
            }))
          );
        }
      });
  }

  function playlistChanged(id) {
    console.log(id);
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getPlaylist(id).then((res) => {
      console.log(res.body.tracks.items);
      setSelectedPlaylist(
        res.body.tracks.items.slice(0, 40).map((list) => {
          return {
            artist: list.track.artists[0].name,
            title: list.track.name,
            uri: list.track.uri,
            albumUrl: list.track.album.images[0].url,
          };
        })
      );
    });
  }

  function removeDuplicates(array, key) {
    const seen = new Set();
    return array.filter((item) => {
      const duplicate = seen.has(item[key]);
      if (!duplicate) seen.add(item[key]);
      return !duplicate;
    });
  }

  const uniquePlaylists = removeDuplicates(selectedPlaylist, "uri");

  const mystyle = {
    height: "100vh",
  };

  const sidebarStyle = {
    width: "15%",
    height: "100vh",
    position: "fixed",
    top: "0",
    left: "0",
    zIndex: "1000",
  };

  const searchStyle = {
    position: "fixed",
    top: "6%",
    left: "250px",
    right: "0",
    bottom: "7%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
    overflowY: "auto",
  };

  const rounded = "rounded";

  const circle = "rounded-circle";

  return (
    <Container fluid className="d-flex flex-row p-0" style={mystyle}>
      {/* Sidebar */}
      <div className="bg-dark text-light" style={sidebarStyle}>
        <div className="p-2">
          <h4>Echo Wrapped</h4>
          <DropdownWrapped timeChanged={timeChanged} />
        </div>
        <div className="p-2">
          Top Songs:
          {topTracks.map((list, index) => (
            <div key={list.id}>
              <TopItems
                list={list}
                index={index}
                rounded={rounded}
                chooseTrack={chooseTrack}
              />
            </div>
          ))}
        </div>
        <div className="p-2">
          Top Artists:
          {topArtists.map((list, index) => (
            <div key={list.id}>
              <TopItems list={list} index={index} rounded={circle} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Container
        fluid
        className="d-flex flex-column py-2 ms-250"
        style={{ marginLeft: "15%" }}
      >
        <Navbar
          expand="lg"
          bg="light"
          className="align-baseline bg-body-tertiary justify-content-between"
        >
          <Container>
            <Navbar.Brand
              onClick={loadFeaturedPlaylist}
              style={{ cursor: "pointer" }}
            >
              <img
                height="40"
                className="d-inline-block align-top"
                src={logo}
                alt="logo"
              />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Form className="d-flex align-items-center">
                <Form.Control
                  className="bg-dark btn-outline-dark text-light me-2"
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container id="dropdowns" className="mt-2">
          <Row className="justify-content-between">
            <Col>
              <div className="p-2"> Select genre:</div>
              <DropdownGr items={genres} genreChanged={genreChanged} />
            </Col>
            <Col>
              <div className="p-2"> Select playlist:</div>
              <DropdownPl items={playlists} playlistChanged={playlistChanged} />
            </Col>
          </Row>
        </Container>
        {search && (
          <Container style={searchStyle}>
            {searchResults.map((track) => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
              />
            ))}
          </Container>
        )}
        <Container className="flex-grow-1 my-3" style={{ overflowY: "auto" }}>
          <Row>
            {uniquePlaylists.map((list) => (
              <Col className="mb-3" key={list.uri}>
                <Playlist
                  list={list}
                  key={list.uri}
                  chooseTrack={chooseTrack}
                />
              </Col>
            ))}
          </Row>
        </Container>
        <div>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </Container>
    </Container>
  );
}
