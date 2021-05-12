import React, { useState, useEffect } from 'react';
import styles from './SearchResults.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { X } from 'react-feather';

// Components

// Utility functions

import { sortSearchResults } from '../../util/helpers/array';

export default function SearchResults({ results, setSearching, showExitButton, handleResultClick, handleClose }) {
  const [sortedResults, setSortedResults] = useState([]);
  const router = useRouter();

  const sortResults = () => {
    let sorted = sortSearchResults(results);
    setSortedResults(sorted);
  }


  useEffect(sortResults, [results])

  return (
    <div className={styles.container}>
      { showExitButton &&
        <div className={styles.closeButton} onClick={handleClose}>
          <X className={styles.closeIcon} />
        </div>
      }
      <div className={styles.searchResults}>
        { sortedResults.map(result => {
          return (
            <Link href={`/card/${result.id}`} key={result.id}>
              <div className={styles.resultWrapper} onClick={handleResultClick}>
                <div className={styles.imageWrapper}>
                  <img src={result.images.small} className={styles.thumbnail} />
                </div>
                <div className={styles.details}>
                  <div className={styles.leftSide}>
                    <span className={classNames(styles.topLine, styles.setName)}>{result.set_name}</span>
                    <span className={styles.cardName}>{result.name}</span>
                  </div>

                  <span className={classNames(styles.topLine, styles.cardNumber)}>#{result.number}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
