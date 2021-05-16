import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { User } from 'react-feather';
import classNames from 'classnames';

// Components
import SearchBar from '../SearchBar/SearchBar';
import HamburgerMenu from '../HamburgerMenu/HamburgerMenu';
import SearchResults from '../SearchResults/SearchResults';
import SignInButton from '../Buttons/SignInButton';

// Utility functions
import { searchCard } from '../../util/algolia/algoliaHelpers';
import analytics from '../../util/analytics/segment';


export default function NavBar({}) {
  const user = useSelector(state => state.user);
  const subscriptionStatus = useSelector(state => state.subscriptionStatus);
  const router = useRouter();

  let queryParam = router.query.search_query ? router.query.search_query.replace(/\+/g, ' ') : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addedUrl, setAddedUrl] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);

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


  const clearSearch = () => {
    setSearchTerm('');
  }

  const updateUrlState = () => {
    if (searching) {
      setAddedUrl(false);
    }
  }

  const updateUrl = (term = '') => {
    let updatedUrl = `${window.location.origin}/search/${term.trim().replace(/\s/g, '+')}`;
    if (!router.pathname.includes('/search')) { // if we're not on a search page, put us on one
      router.push(updatedUrl);
      setAddedUrl(true);
    } else { // if we are on a search page, just replace the url
      router.replace(updatedUrl, null, { shallow: true });
    }
  }

  const changeSearchTerm = (term) => {
    // Treat zero to one term as a new search
    if (searchTerm.length === 0 && term.length === 1) {
      analytics.track({
        userId: user.id,
        event: 'Card searched'
      });
    }

    updateUrl(term);
    setSearchTerm(term);
  }

  const loadQuery = () => {
    const shouldLoadQuery = !previousPath || !previousPath.includes('/search');

    if (queryParam && shouldLoadQuery) {
      setPreviousPath(router.pathname);
      setSearching(true);
      setSearchTerm(queryParam);
    } else if (!router.pathname.includes('/search')) {
      setSearching(false);
      setPreviousPath(router.pathname);
      setCanGoBack(true);
    }
  }

  const handleFocus = () => {
    // liveSearch();

    if (searchTerm.length > 0) {
      setSearching(true);
      updateUrl(searchTerm);
    }
  }

  const handleResultClick = () => {
    setSearching(false);
  }

  const handleClose = () => {
    let path = router.pathname;
    if (path.includes('/search')) {
      router.back();
      setSearching(false);
    } else {
      setSearching(false);
    }
  }

  useEffect(liveSearch, [searchTerm]);
  useEffect(loadQuery, [router]);
  useEffect(updateUrlState, [searching]);

  return (
    <div className={styles.container}>
      <div className={classNames({ [styles.brandWrapper]: true, [styles.signedInBrand]: !!user.id }) }>
        <Link href={'/'}>
          <img src={'/images/brand.png'} alt={'wordmark'} className={styles.brand} />
        </Link>
      </div>

      <HamburgerMenu />

      { subscriptionStatus === 'active' &&
        <SearchBar searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} setSearching={setSearching} handleFocus={handleFocus} />
      }


      <div className={styles.rightSide}>
        { !user.id && !router.pathname.includes('sign-in') &&
          <SignInButton />
        }

        { subscriptionStatus === 'active' &&
          <Link href={'/profile/settings'}>
            <div className={styles.userButton}>
              <User />
            </div>
          </Link>
        }
      </div>

      { searching &&
        <SearchResults results={results} setSearching={setSearching} previousPath={previousPath} showExitButton={canGoBack} handleResultClick={handleResultClick} handleClose={handleClose} />
      }
    </div>
  )
}
