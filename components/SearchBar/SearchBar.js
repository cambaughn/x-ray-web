import React from 'react';
import styles from './SearchBar.module.scss';

// Components

// Utility functions

export default function SearchBar({ searchTerm, changeSearchTerm, setSearching }) {
  return (
    <div className={styles.container}>
      <input
        type='text'
        value={searchTerm}
        className={styles.searchBar}
        onChange={event => changeSearchTerm(event.target.value)}
        placeholder='Card/set name...'
        spellCheck={false}
        onFocus={() => setSearching(true)}
      />
    </div>
  )
}
