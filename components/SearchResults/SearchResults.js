import React, { useRef } from 'react';
import styles from './SearchResults.module.scss';
import Link from 'next/link';
import classNames from 'classnames';
import { connectInfiniteHits } from 'react-instantsearch-dom';

// Components

// Utility functions

const SearchResults = ({ hits }) => {
  const sentinel = useRef(null);

  return (
    <div className={styles.container}>
      <div className={styles.searchResults}>
        { hits.map(result => {
          return (
            <Link href={`/card/${result.id}`} key={result.id}>
              <div className={styles.resultWrapper}>
                <img src={result.images.small} className={styles.thumbnail} />
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

        <span className="ais-InfiniteHits-sentinel" ref={sentinel}></span>
      </div>
    </div>
  )
}

export default connectInfiniteHits(SearchResults);
