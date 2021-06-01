import React, { useState, useEffect } from 'react';
import styles from './CollectionList.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';

// Components

// Utility functions

export default function CollectionList({ sales }) {
  const collectionDetails = useSelector(state => state.collectionDetails);
  const collectedItems = useSelector(state => state.collectedItems);

  return (
    <div className={styles.container}>
      { collectionDetails.length === 0 &&
        <span className={styles.emptyCollectionMessage}>Search to find cards and add to your collection</span>
      }
      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id];
        let salesForItem = sales[index];
        // Get price for this individual item
        let price = salesForItem ? salesForItem.formatted_data[salesForItem.formatted_data.length - 1].averagePrice.toFixed(2) : '--';

        return item ? (
          <Link href={`/card/${item.id}`} key={`${item.id}-${index}`}>
            <div className={styles.resultWrapper}>
              <img src={item.images.small} className={styles.thumbnail} />
              <div className={styles.details}>
                <div className={styles.leftSide}>
                  <span className={classNames(styles.topLine, styles.setName)}>{item.set_name}</span>
                  <span className={styles.cardName}>{item.name}</span>
                </div>

                <div className={styles.rightSide}>
                  <span className={classNames(styles.topLine, styles.cardNumber)}>#{item.number}</span>
                  <span className={styles.price}>{price !== '--' ? `$${price}` : price}</span>
                </div>

              </div>
            </div>
          </Link>
        ) : null
      })}
    </div>
  )
}
