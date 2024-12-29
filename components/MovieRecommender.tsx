"use client";

import { useState } from "react";

const options = ["Option 1", "Option 2", "Option 3", "Option 4"]; // Dropdown options

const MovieRecommender = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleRecommend = () => {
    if (selectedOption) {
      alert(`You selected: ${selectedOption}`);
    } else {
      alert("Please select an option!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 rounded-lg shadow-md text-center">
        <h1 className="mb-4 text-xl font-semibold text-gray-700">
          Make a Selection
        </h1>
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={handleRecommend}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Recommend
          </button>
        </div>
        {selectedOption && (
          <p className="mt-4 text-gray-600">
            Selected Option:{" "}
            <span className="font-medium">{selectedOption}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieRecommender;
