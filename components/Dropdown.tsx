"use client";

import { useState } from "react";

interface DropdownProps {
  options: string[]; // Array of options to display
  onSelect: (selectedOption: string) => void; // Method to handle the selected option
  selectedOption: string;
}

const DropdownSearch: React.FC<DropdownProps> = ({
  options,
  onSelect,
  selectedOption,
}) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  // Function to handle the search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter options based on the search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        id="dropdownSearchButton"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {selectedOption || "Select a movie"}
        {/* Show selected movie or default text */}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="z-10 absolute bg-white rounded-lg shadow w-60 dark:bg-gray-700 mt-2">
          <div className="p-3">
            <label htmlFor="input-group-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="input-group-search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search option"
              />
            </div>
          </div>
          <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
            {filteredOptions.length === 0 ? (
              <li className="text-center text-gray-500 dark:text-gray-400">
                No results found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li key={index}>
                  <div
                    onClick={() => {
                      onSelect(option); // Call the onSelect method with the selected option
                      setIsOpen(false); // Close the dropdown after selection
                    }}
                    className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  >
                    <label className="w-full py-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      {option}
                    </label>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;