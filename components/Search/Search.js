import React, { useState, useEffect } from 'react';
import styles from './Search.module.scss';

// Components

// Utility functions

export default function Search({}) {
  const [searchTerm, setSearchTerm] = useState('');

  console.log('search term ', searchTerm);

  return (
    <div className={styles.container}>
      <h3>Search</h3>
      <input
        type='text'
        className={styles.searchBar}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder='Card/set name...'
      />
    </div>
  )
}
