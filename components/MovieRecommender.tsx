"use client";

import { useState, useEffect } from "react";
import pako from "pako"; // Import pako for gzip decompression

interface MovieType {
  movie_id: number;
  title: string;
  tags: string;
}

const MovieRecommender = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [movies, setMovies] = useState<MovieType[]>([]); // State to store movies
  const [similarity, setSimilarity] = useState([]); // State to store similarity data
  const [recommendedMovies, setRecommendedMovies] = useState<{
    names: string[];
  }>({
    names: [],
  });

  // Function to fetch and decompress the movies data
  const fetchMovies = async () => {
    try {
      const response = await fetch("/movies.json.gz"); // Fetch the .gz file from the public folder
      const arrayBuffer = await response.arrayBuffer(); // Read the file as an array buffer
      const decompressedData = pako.ungzip(new Uint8Array(arrayBuffer), {
        to: "string",
      }); // Decompress the data using pako
      const jsonData = JSON.parse(decompressedData); // Parse the decompressed JSON
      setMovies(jsonData); // Store the movies data in state
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Function to fetch and decompress the similarity data
  const fetchSimilarity = async () => {
    try {
      const response = await fetch("/similarity.json.gz"); // Fetch the .gz file from the public folder
      const arrayBuffer = await response.arrayBuffer(); // Read the file as an array buffer
      const decompressedData = pako.ungzip(new Uint8Array(arrayBuffer), {
        to: "string",
      }); // Decompress the data using pako
      const jsonData = JSON.parse(decompressedData); // Parse the decompressed JSON
      setSimilarity(jsonData); // Store the similarity data in state
    } catch (error) {
      console.error("Error fetching similarity data:", error);
    }
  };

  // Fetch movies and similarity data when the component is mounted
  useEffect(() => {
    fetchMovies();
    fetchSimilarity();
  }, []);

  // Function to fetch movie posters (this can be modified as per your API for fetching posters)
  const fetchPoster = (movieId: number) => {
    // You can replace this with your API for fetching movie posters
    return `https://image.tmdb.org/t/p/w500/${movieId}.jpg`;
  };

  // Recommend similar movies based on selected movie
  const recommend = (movie: string) => {
    const index = movies.findIndex((m) => m.title === movie); // Find movie index based on title

    // If movie is not found, return empty lists
    if (index === -1) return { names: [], posters: [] };

    // Get the similarity scores for the selected movie
    const movieSimilarities = similarity[index];

    // Sort the similarities in descending order and get top 5 most similar movies (excluding the movie itself)
    const sortedSimilarities = [...movieSimilarities]
      .map((score, i) => ({ index: i, score }))
      .sort((a, b) => b.score - a.score)
      .slice(1, 6); // Exclude the movie itself

    const recommendedMovieNames = sortedSimilarities.map(
      (item) => movies[item.index].title
    );

    return { names: recommendedMovieNames };
  };

  const handleRecommend = () => {
    if (selectedOption) {
      const { names } = recommend(selectedOption);
      setRecommendedMovies({ names });
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
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <option key={index} value={movie.title}>
                  {movie.title}
                </option>
              ))
            ) : (
              <option>Loading movies...</option>
            )}
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
      {recommendedMovies.names.length > 0 && (
        <div className="mt-8 w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-white">Recommended Movies</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {recommendedMovies.names.map((movie, index) => (
              <div key={index} className="text-center">
                <img
                  src={recommendedMovies.posters[index]}
                  alt={movie}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-gray-300">{movie}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieRecommender;
