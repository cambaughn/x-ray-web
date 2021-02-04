import React, { useState, useEffect } from 'react';
import styles from './Search.module.scss';

// Components

// Utility functions
import { searchCard } from '../../util/algolia/algoliaHelpers';

export default function Search({}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const liveSearch = async () => {
    try {
      if (searchTerm.length > 0) {
        let searchResults = await searchCard(searchTerm);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(liveSearch, [searchTerm]);

  return (
    <div className={styles.container}>
      <h3>Search</h3>
      <input
        type='text'
        className={styles.searchBar}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder='Card/set name...'
        autoFocus
      />

      <div className={styles.searchResults}>
        { results.map(result => {
          return (
            <div className={styles.resultWrapper} key={result.id} >
              <img src={result.thumbnail} className={styles.thumbnail} />
              {/* <span className={styles.cardName}>{result.name}</span> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
