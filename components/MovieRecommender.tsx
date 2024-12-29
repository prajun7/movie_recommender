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
    <div className="flex justify-center h-screen text-white">
      <div className="p-6 rounded-lg shadow-md text-center">
        <div className="mb-4 text-12xl font-semibold">
          Watch the Movie You Like
        </div>
        <div className="mb-14">
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
        </div>
        <div className="mt-8">
          <button
            onClick={handleRecommend}
            className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Recommend
          </button>
        </div>

        {selectedOption && (
          <p className="mt-4">
            Selected Option:{" "}
            <span className="font-medium">{selectedOption}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieRecommender;
