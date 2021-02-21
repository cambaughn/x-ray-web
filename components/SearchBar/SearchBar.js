import React from 'react';
import styles from './SearchBar.module.scss';

// Components

// Utility functions

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className={styles.container}>
      <input
        type='text'
        value={searchTerm}
        className={styles.searchBar}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder='Card/set name...'
      />
    </div>
  )
}
