"use client";

import { useState } from "react";

const MovieRecommender = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const options = [
    "Inception",
    "Interstellar",
    "The Dark Knight",
    "Avatar",
    "Titanic",
  ]; // Example movie options

  const handleRecommend = () => {
    if (selectedOption) {
      alert(`We’ll recommend 5 movies similar to ${selectedOption}!`);
    } else {
      alert("Please select a movie first.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-black text-white">
      <h1 className="text-3xl font-extrabold text-center tracking-tight sm:text-4xl">
        Watch the Movie You Like
      </h1>
      <p className="mt-4 text-lg text-center text-gray-400 max-w-xl">
        Select a movie you enjoyed, and we’ll recommend 5 similar movies you'll
        absolutely love. Let's make your next movie night unforgettable!
      </p>
      <div className="mt-8 w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <div className="space-y-4">
          <label
            htmlFor="movie-select"
            className="block text-sm font-medium text-gray-300"
          >
            Select a Movie
          </label>
          <select
            id="movie-select"
            className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled selected>
              Choose a movie
            </option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            onClick={handleRecommend}
            className="w-full px-4 py-2 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Recommend
          </button>
        </div>
        {selectedOption && (
          <p className="mt-6 text-center text-gray-400">
            Selected Movie:{" "}
            <span className="font-semibold text-white">{selectedOption}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieRecommender;
