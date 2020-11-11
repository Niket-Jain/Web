import React, { useState } from "react";

function App() {
  
  // State for a single line Input
  const [text, setText] = useState("add items");

  // State for saving the items in an Array.
  const [itemList, setItemList] = useState(
    // An empty array for starting.
    []
  );

  function textHandle(event) {
    const newValue = event.target.value;
    setText(newValue);
  }

  function addItem() {
    setItemList((prev) => {
      // ...prev is a spread operator of JS6
      return [...prev, text];
    });

    setText("");
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input name="listItem" onChange={textHandle} type="text" value={text} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {itemList.map((item) => (
            <li> {item} </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
