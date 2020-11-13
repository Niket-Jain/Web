import React, { useState } from "react";

function App() {
  // State for a single line Input
  // const [text, setText] = useState("");

  // State for saving the items in an Array.
  const [itemList, setItemList] = useState(
    // An empty array for starting.
    []
  );

  // function textHandle(event) {
  //   setText(event.target.value);
  // }

  // function addItem() {
  //   // Check whether the text is empty or not
  //   if (text.length > 0) {
  //     setItemList((prevItemList) => {
  //       // ...prevItemList is a spread operator of JS6
  //       return [...prevItemList, text];
  //     });

  //     setText("");
  //   }
  // }

  function emptyTodo() {
    // Empty the todo list
    setItemList([]);
  }

  // Delete a specific item in the array
  function deleteTodo(index) {

    // Create a copy of the orginal list
    let _itemList = [...itemList];

    // Delete the item at the desired index
    _itemList.splice(index, 1);

    // Set the new array as `itemList`
    setItemList(_itemList);
  }

  function handleSubmit(event) {
    // Prevent the default behaviour of form submit
    // After form submission, the user will be redirected to the
    // `action` url provided in the form, but we don't want that.
    // Basically, prevent the form to reload the page
    event.preventDefault();

    // Accessing the form
    const form = event.target;

    // Accessing the input field
    // using the `name` atrribute provided in the html
    const inputField = form.elements["listItem"];

    // Accessing the value of input field and removing trailing spaces
    const inputText = inputField.value.trim();

    // Check whether the text is empty or not
    if (inputText.length > 0) {
      // Adding todo

      // Adding items at front of the array,
      // so that newly added items remains at the top
      setItemList((prevItemList) => [inputText, ...prevItemList]);

      // Reseting the input field
    }
    inputField.value = "";
  }

  return (
    <div className="container">

      <div className="heading">
        <h1>To-Do List</h1>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input
          name="listItem"
          placeholder="Add items..."
          // onChange={textHandle}
          type="text"
          // value={text}
        />

        <button type="submit">
          <span>Add</span>
        </button>
      </form>

      <div>
        <ul>
          {itemList.map((item, index) => (
            <li key={"item-" + index}>
              {item}
              <span onClick={() => deleteTodo(index)}>X</span>
            </li>
          ))}
        </ul>
        {itemList.length > 0 ? (
          <button onClick={emptyTodo}>
            <span>Delete all</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default App;
