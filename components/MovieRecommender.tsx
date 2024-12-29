"use client";

import { useState, useEffect } from "react";
import pako from "pako"; // Import pako for gzip decompression
import Dropdown from "./Dropdown";

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
    posterUrl: string[];
  }>({
    names: [],
    posterUrl: [],
  });

  // Function to fetch movie posters from TMDb API
  const fetchPoster = async (movieId: number) => {
    const apiKey = "8265bd1679663a7ea12ac168da84d2e8"; // Your TMDb API key
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    try {
      // Fetch the movie data from the API
      const response = await fetch(url);
      const data = await response.json();

      // Extract the poster path
      const posterPath = data.poster_path;

      // Construct the full poster URL, if available
      if (posterPath) {
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
      }

      // Fallback if poster is not available
      return "https://via.placeholder.com/500x750?text=No+Image"; // Use a placeholder image
    } catch (error) {
      console.error("Error fetching movie poster:", error);
      // Return a placeholder image in case of an error
      return "https://via.placeholder.com/500x750?text=No+Image";
    }
  };

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

  // Modify the recommend function to include poster fetching
  const recommend = async (movie: string) => {
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

    // Fetch the poster URLs for the recommended movies
    const recommendedMoviePosters = await Promise.all(
      sortedSimilarities.map(async (item) => {
        const movieId = movies[item.index].movie_id; // Assuming movie_id is available in your data
        return await fetchPoster(movieId); // Fetch the poster for each recommended movie
      })
    );

    return { names: recommendedMovieNames, posters: recommendedMoviePosters };
  };

  const handleRecommend = async (movie: string) => {
    if (movie) {
      setSelectedOption(movie); // Update the selected movie
      const { names, posters } = await recommend(movie);
      setRecommendedMovies({ names, posterUrl: posters });
    } else {
      alert("Please select a movie first.");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-20 x-4 bg-black text-white">
        <h1 className="text-3xl font-extrabold text-center tracking-tight sm:text-4xl">
          Watch the Movie You Like
        </h1>
        <p className="mt-4 text-lg text-center text-gray-400 max-w-xl">
          Select a movie you enjoyed, and we’ll recommend 5 similar movies
          you'll absolutely love. Let's make your next movie night
          unforgettable!
        </p>
        <div className="mt-8 w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
          <div className="space-y-4">
            <label
              htmlFor="movie-select"
              className="block text-sm font-medium text-gray-300"
            >
              Select a Movie
            </label>
            <Dropdown
              options={movies.map((movie) => movie.title)}
              onSelect={handleRecommend}
              selectedOption={selectedOption} // Pass selectedOption to Dropdown
            />
          </div>
        </div>

        {recommendedMovies.names.length > 0 && (
          <div className="mt-8 mb-36 w-full max-w-5xl p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-center font-bold text-white mb-8">
              Recommended Movies
            </h2>
            <div className="mt-4 grid grid-cols-5 gap-4">
              {recommendedMovies.names.map((movie, index) => (
                <div key={index} className="text-center">
                  <img
                    src={recommendedMovies.posterUrl[index]}
                    alt={movie}
                    className="w-full h-full object-cover rounded-lg mb-2 
          blur-lg transition-all duration-500 ease-in-out 
          hover:blur-0"
                    onLoad={(e) =>
                      (e.target as HTMLImageElement).classList.remove("blur-lg")
                    }
                  />
                  <p className="text-gray-300 font-bold tracking-wide">
                    {movie}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRecommender;
