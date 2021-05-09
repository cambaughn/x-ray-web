import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { User } from 'react-feather';
import classNames from 'classnames';

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
  const router = useRouter();

  let queryParam = router.query.search_query ? router.query.search_query.replace(/\+/g, ' ') : null;
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addedUrl, setAddedUrl] = useState(false);
  const [previousPath, setPreviousPath] = useState('');

  const liveSearch = async () => {
    try {
      if (searchTerm.length > 0) {
        console.log('live searching');
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

  const updateUrl = (term) => {
    let updatedUrl = `${window.location.origin}/search/${term.trim().replace(/\s/g, '+')}`;
    console.log('updating url ', updatedUrl);
    if (!addedUrl) {
      router.push(updatedUrl);
      setAddedUrl(true);
    } else {
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
    if (queryParam && !previousPath.includes('/search')) {
      setPreviousPath(router.pathname);
      setSearchTerm(queryParam);
      setSearching(true);
    } else if (!router.pathname.includes('/search')) {
      setSearching(false);
      setPreviousPath(router.pathname);
    }
  }

  console.log('previouse path ', router);

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

      { subscriptionStatus === 'active' &&
        <SearchBar searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} setSearching={setSearching} />
      }
      {/* { subscriptionStatus === 'active' &&
        <SearchBar searchTerm={searchTerm} changeSearchTerm={changeSearchTerm} />
      } */}

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
        <SearchResults results={results} setSearching={setSearching} previousPath={previousPath} showExitButton={!previousPath.includes('/search') && previousPath.length > 0} />
      }
    </div>
  )
}
