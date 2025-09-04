import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    onSearch(query.trim());
    setQuery(""); // clear input after search
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center gap-2 p-4"
    >
      {/* Input Box */}
      <input
        type="text"
        placeholder="Search by ingredient (e.g. chicken, egg)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 transition-colors duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
