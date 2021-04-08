import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// Components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import SignInButton from '../Buttons/SignInButton';

// Utility functions
import { searchCard } from '../../util/algolia/algoliaHelpers';
import analytics from '../../util/analytics/segment';


export default function NavBar({}) {
  const user = useSelector(state => state.user);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);

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

  const changeSearchTerm = (term) => {
    // Treat zero to one term as a new search
    if (searchTerm.length === 0 && term.length === 1) {
      analytics.track({
        userId: user.id,
        event: 'Card searched'
      });
    }

    setSearchTerm(term);
  }

  return (
    <div className={styles.container}>
      <div className={styles.brandWrapper}>
        <Link href={'/'}>
          <img src={'/images/brand.png'} alt={'wordmark'} className={styles.brand} />
        </Link>
      </div>

      { !!user.id &&
        <SearchBar searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} />
      }
      {/* { subscriptionStatus === 'active' &&
        <SearchBar searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} />
      } */}

      <div className={styles.rightSide}>
        { !user.id && !router.pathname.includes('sign-in') &&
          <SignInButton />
        }
      </div>

      { searchTerm.length > 0 &&
        <SearchResults results={results} clearSearch={clearSearch} />
      }
    </div>
  )
}
