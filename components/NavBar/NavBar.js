import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

// Utility functions
import { searchCard } from '../../util/algolia/algoliaHelpers';


export default function NavBar({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

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

  const clearSearch = () => {
    setSearchTerm('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.brandWrapper}>
        <Link href={!!user.id ? '/search' : '/'}>
          <img src={'/images/brand.png'} alt={'wordmark'} className={styles.brand} />
        </Link>
      </div>

      { !!user.id &&
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      }
      <div className={styles.placeholder}></div>

      { searchTerm.length > 0 &&
        <SearchResults results={results} clearSearch={clearSearch} />
      }
    </div>
  )
}
