import React from 'react';
import styles from './SearchBar.module.scss';

// Components

// Utility functions

export default function SearchBar({ searchTerm, changeSearchTerm, setSearching }) {
  const handleChange = (event) => {
    let updatedTerm = event.target.value;
    if (updatedTerm.length > 0) {
      setSearching(true);
      changeSearchTerm(updatedTerm);
    } else {
      setSearching(false);
      changeSearchTerm(updatedTerm);
    }
  }

  return (
    <div className={styles.container}>
      <input
        type='text'
        value={searchTerm}
        className={styles.searchBar}
        onChange={handleChange}
        placeholder='Card/set name...'
        spellCheck={false}
        onFocus={() => searchTerm.length > 0 && setSearching(true)}
      />
    </div>
  )
}
