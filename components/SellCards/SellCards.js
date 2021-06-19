import React, { useState, useEffect } from 'react';
import styles from './SellCards.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions

export default function SellCards({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Sell your cards</h3>

      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id];

        return (
          <div className={styles.itemRow} key={item.id + index}>
            <span className={styles.itemName}>{item.name}</span>
          </div>
        )
      })}
    </div>
  )
}
