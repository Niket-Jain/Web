import React from "react";
import HighlightIcon from "@material-ui/icons/Highlight";

function Header() {
  // Added icon 
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper
      </h1>
    </header>
  );
}

export default Header;
