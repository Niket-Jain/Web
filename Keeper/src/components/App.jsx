import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import note from "../note";
import Note from "./Note";

function createNote(note) {
  return <Note key={note.id} title={note.title} content={note.content} />;
}

function App() {
  return (
    <div>
      <Header />

      {note.map(createNote)}

      <Footer />
    </div>
  );
}

export default App;