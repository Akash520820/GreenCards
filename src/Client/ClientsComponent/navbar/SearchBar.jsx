import React from "react";
import { IoIosSearch } from "react-icons/io";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-wrapper d-flex align-items-center">
      <input
        className="form-control search-input"
        type="search"
        placeholder="Search products"
        aria-label="Search"
      />
      <button className="search-btn btn ms-2" type="button" onClick={onSearch} aria-label="Search">
        <IoIosSearch size={25} aria-hidden="true"/>
      </button>
    </div>
  );
};

export default SearchBar;