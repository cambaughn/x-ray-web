import React from 'react';
import styles from './SearchBar.module.scss';

// Components

// Utility functions

export default function SearchBar({ setSearchTerm }) {
  return (
    <div className={styles.container}>
      <input
        type='text'
        className={styles.searchBar}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder='Card/set name...'
      />
    </div>
  )
}
