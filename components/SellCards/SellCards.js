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
        let item = collectedItems[detail.item_id] || {};
        let image_src = null;
        if (item && item.images) {
          image_src = item.images.small || item.images.large;
        }

        return (
          <div className={classNames(styles.itemRow, { [styles.selectedRow]: selected.has(detail.id) })} onClick={() => toggleSelect(detail.id)} key={index}>
            <img src={image_src} className={styles.cardImage} />
            <span className={classNames(styles.detailCell, styles.itemName)}>{item.name}</span>
            <span className={classNames(styles.detailCell, styles.grade)}>{detail.grading_authority && detail.grade ? `${detail.grading_authority} ${detail.grade}` : 'Ungraded'}</span>
            <span className={classNames(styles.detailCell, styles.setName)}>{item.set_name}</span>
            <span className={classNames(styles.detailCell, styles.number)}>#{item.number}</span>

            <span className={classNames(styles.detailCell, styles.language)}>{item.language === 'en' ? 'English' : 'Japanese'}</span>
          </div>
        )
      })}
    </div>
  )
}
