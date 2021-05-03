import React, { useState, useEffect } from 'react';
import styles from './CollectionList.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';

// Components

// Utility functions

export default function CollectionList({}) {
  const collectionDetails = useSelector(state => state.collectionDetails);
  const collectedItems = useSelector(state => state.collectedItems);

  return (
    <div className={styles.container}>
      { collectionDetails.map(detail => {
        let item = collectedItems[detail.item_id];

        return item ? (
          <Link href={`/card/${item.id}`} key={item.id}>
            <div className={styles.resultWrapper}>
              <img src={item.images.small} className={styles.thumbnail} />
              <div className={styles.details}>
                <div className={styles.leftSide}>
                  <span className={classNames(styles.topLine, styles.setName)}>{item.set_name}</span>
                  <span className={styles.cardName}>{item.name}</span>
                </div>

                <span className={classNames(styles.topLine, styles.cardNumber)}>#{item.number}</span>
              </div>
            </div>
          </Link>
        ) : null
      })}
    </div>
  )
}
