import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';

// Components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

// Utility functions
import { searchCard } from '../../util/algolia/algoliaHelpers';


export default function NavBar({}) {
  const [searchTerm, setSearchTerm] = useState('');
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
      <div className={styles.brandWrapper}>
        <Link href="/">
          <img src={'/images/brand.png'} alt={'wordmark'} className={styles.brand} />
        </Link>
      </div>

      <SearchBar setSearchTerm={setSearchTerm} />

      <div className={styles.placeholder}></div>

      { searchTerm.length > 0 &&
        <SearchResults results={results} />
      }
    </div>
  )
}
