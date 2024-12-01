import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function SearchArticles({ onSearch , isMyArticle }) {
  const [searchBy, setSearchBy] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const options = ["All", "Author", "Title", "Tags", "Description"].filter(
    (option) => !(isMyArticle && option === "Author")
  );

  const handleSearch = () => {
    onSearch(searchBy, searchQuery);
  };

  return (
    <div className="flex justify-center items-center mb-10 z-100">
      <div className="flex space-x-4 text-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search by ${searchBy.toLowerCase()}`}
          className="text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 w-128"
        />
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors flex items-center"
          >
            {searchBy} <FontAwesomeIcon icon={faChevronDown} className="text-gray1 text-sm ml-2 z-50" />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-1 shadow rounded-box w-52 text-sm z-50 bg-white"
          >
            {options.map((option) => (
              <li key={option}>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-xl"
                  onClick={() => setSearchBy(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          className="text-xl bg-black px-10 py-3 rounded-sm border border-gray1 text-white hover:bg-blue hover:text-white transition-colors"
          onClick={handleSearch}
        >
          Search
        </button>
        <button
          className="text-xl px-10 py-3 rounded-sm border border-gray1 text-gray1 hover:bg-blue hover:text-white transition-colors"
          onClick={() => {
            setSearchBy("All");
            setSearchQuery("");
            onSearch("All", "");
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
