import React from "react";

function Note(parse) {
  return (
    <div className="note">
      <h1>{parse.title}</h1>
      <p>{parse.content}</p>
    </div>
  );
}

export default Note;
