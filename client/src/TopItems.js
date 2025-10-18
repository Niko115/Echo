import React from "react";
import { Row } from "react-bootstrap";
import "./style.css";

export default function TopItems({ list, index, rounded, chooseTrack}) {
  function handlePlay() {
    chooseTrack(list)
  }

  return (
    <Row className="d-flex align-items-center px-3 pb-2">
      <div className={`d-flex align-items-center ${rounded === "rounded" ? "hover-overlay-container" : ""}`} role={rounded === "rounded" ? "button" : undefined}  onClick={handlePlay}>
      <img
        src={list.albumImg}
        alt={list.id}
        width="64px"
        height="64px"
        className={`me-3 ${rounded}`}
        style={{ objectFit: "cover" }} 
      />
      <div
        className="d-flex align-items-center"
        style={{
          flex: 1,
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflow: "hidden",
        }}
      >
        <span
          className="text-wrap px-2"
          style={{
            fontSize: "18px",
            lineHeight: "1.2",
          }}
        >
          #{index + 1} {list.name}
        </span>
      </div>
      </div>
    </Row>
  );
}