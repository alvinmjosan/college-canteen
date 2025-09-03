import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../HomePage.css";

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <div className={`search-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for food items"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
          className="search-input"
        />
        <button type="submit" className="search-button">
        <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;