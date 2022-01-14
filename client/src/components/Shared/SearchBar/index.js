import React from "react";
import { Search } from "react-feather";
import Button from "@material-ui/core/Button";

import "./styles.css";

function SearchBar() {
  // const [isExpanded, setIsExpanded] = useState(false);
  // const [filterName, setFilterName] = useState("Sort by");

  return (
    <div>
      <form className="searchBar">
        <div className="searchBarInnerWrapper">
          <input className="searchInput" type="search" placeholder="Search" />
          <Button
            className="searchButton"
            variant="outlined"
            style={{
              borderWidth: "2px",
              borderRadius: 15,
              borderColor: "#4A4E69",
              color: "#4A4E69",
            }}
          >
            <Search color="#4A4E69" />
          </Button>
        </div>
      </form>
      {/* <div className="filterBar" onClick={() => setIsExpanded(!isExpanded)}>
        <p className="filterName">{filterName}</p>
      </div>
      <div>
        {isExpanded && (
          <div onClick={() => setIsExpanded(false)} className="filterOptions">
            <ul className="filterList">
              <li
                className="filterItem"
                onClick={() => {
                  setFilterName("Cleanliness");
                }}
              >
                Cleanliness
              </li>
              <li
                className="filterItem"
                onClick={() => {
                  setFilterName("Functionality");
                }}
              >
                Functionality
              </li>
              <li
                className="filterItem"
                onClick={() => {
                  setFilterName("Privacy");
                }}
              >
                Privacy
              </li>
            </ul>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default SearchBar;
