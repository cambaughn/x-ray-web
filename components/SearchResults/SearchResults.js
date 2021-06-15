import React, { useState, useEffect } from 'react';
import styles from './SearchResults.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { X } from 'react-feather';

// Components
import SetInfoCard from '../SetInfoCard/SetInfoCard';
import CardImage from '../CardImage/CardImage';

// Utility functions
import { sortSearchResults } from '../../util/helpers/array';
import { isMobile } from '../../util/design/designHelpers.js';


export default function SearchResults({ results, sets, setSearching, showExitButton, handleResultClick, handleClose }) {
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
        <div className={styles.resultsForSets}>
          { sets.slice(0, isMobile() ? 2 : sets.length).map(set => {
            return (
              <SetInfoCard set={set} key={set.id} />
            )
          })}
        </div>

        <div className={styles.resultsForCards}>
          { sortedResults.map(result => {
            return (
              <Link href={`/card/${result.id}`} key={result.id}>
                <div className={styles.resultWrapper} onClick={handleResultClick}>
                  <CardImage card={result} size={'small'} />

                  {/* <div className={styles.imageWrapper}>
                    <img src={result.images.small} className={styles.thumbnail} />
                  </div> */}
                  <div className={styles.details}>
                    <div className={styles.leftSide}>
                      <span className={classNames(styles.topLine, styles.setName)}>{result.set_name}</span>
                      <span className={styles.cardName}>{result.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
