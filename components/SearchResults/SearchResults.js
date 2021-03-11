import React from 'react';
import styles from './SearchResults.module.scss';
import Link from 'next/link';

// Components

// Utility functions

export default function SearchResults({ results, clearSearch }) {
  console.log('got results ', results);
  return (
    <div className={styles.container}>
      <div className={styles.searchResults}>
        { results.map(result => {
          return (
            <Link href={`/card/${result.id}`} key={result.id}>
              <div className={styles.resultWrapper} onClick={clearSearch}>
                <img src={result.images.small} className={styles.thumbnail} />
                <span className={styles.cardName}>{result.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}