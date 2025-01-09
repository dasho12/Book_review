import React, { useState } from "react";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <main>
      <h2>Welcome to the Home Page</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
    </main>
  );
};

export default Home;
