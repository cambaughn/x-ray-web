import React, { useState, useEffect } from 'react';
import styles from './SellCards.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// Components

// Utility functions

export default function SellCards({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (detail_id) => {
    let newSelected = new Set(selected);
    if (newSelected.has(detail_id)) {
      newSelected.delete(detail_id);
    } else {
      newSelected.add(detail_id);
    }

    setSelected(newSelected);
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Sell your cards</h3>

      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id];

        return (
          <div className={classNames(styles.itemRow, { [styles.selectedRow]: selected.has(detail.id) })} onClick={() => toggleSelect(detail.id)} key={item.id + index}>
            {/* TODO: Fix item.images undefined error */}
            <img src={item && item.images && item.images.small ? item.images.small : item.images.large} className={styles.cardImage} />
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemLanguage}>{item.language === 'en' ? 'English' : 'Japanese'}</span>
          </div>
        )
      })}
    </div>
  )
}
