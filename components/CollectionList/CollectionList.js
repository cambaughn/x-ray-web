import React, { useState, useEffect } from 'react';
import styles from './CollectionList.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';
import { MinusCircle } from 'react-feather';

// Components

// Utility functions
import collectedItem from '../../util/api/collection';
import { setCollectionDetails } from '../../redux/actionCreators';


export default function CollectionList({ sales }) {
  const collectionDetails = useSelector(state => state.collectionDetails);
  const collectedItems = useSelector(state => state.collectedItems);
  const user = useSelector(state => state.user);

  const [hoveredItem, setHoveredItem] = useState(null);
  const dispatch = useDispatch();


  const removeItem = async(item, event) => {
    event.stopPropagation();
    console.log(item);

    await collectedItem.archive(item);
    let collection_details = await collectedItem.getForUser(user.id);
    dispatch(setCollectionDetails(collection_details));
  }

  return (
    <div className={styles.container}>
      { collectionDetails.length === 0 &&
        <span className={styles.emptyCollectionMessage}>Search to find cards and add to your collection</span>
      }
      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id];
        let salesForItem = sales[index];
        let changeStatus = 'flat'; // up, down, flat
        // Get price for this individual item
        let price = salesForItem ? salesForItem.formatted_data[salesForItem.formatted_data.length - 2].averagePrice : '--';
        let previousPrice = salesForItem ? salesForItem.formatted_data[salesForItem.formatted_data.length - 3].averagePrice : '--';

        if (price > previousPrice) {
          changeStatus = 'up';
        } else if (price < previousPrice) {
          changeStatus = 'down';
        }


        return item ? (
          <Link href={`/card/${item.id}`} key={`${item.id}-${index}`}>
            <div className={styles.resultWrapper} onMouseEnter={() => setHoveredItem(index)} onMouseLeave={() => setHoveredItem(null)}>
              <img src={item.images.small} className={styles.thumbnail} />
              <div className={styles.details}>
                <div className={styles.leftSide}>
                  <span className={classNames(styles.topLine, styles.setName)}>{item.set_name.replace('Black Star ', '')}</span>
                  <span className={styles.cardName}>{item.name}</span>
                </div>

                <div className={styles.rightSide}>
                  <span className={classNames(styles.topLine, styles.cardNumber)}>#{item.number}</span>
                  <span className={classNames({ [styles.price]: true, [styles.priceUp]: changeStatus === 'up', [styles.priceDown]: changeStatus === 'down', [styles.priceFlat]: changeStatus === 'flat' })}>{price !== '--' ? `$${price.toFixed(2)}` : price}</span>
                </div>
              </div>
              { hoveredItem === index &&
                <div className={styles.removeButton} onClick={(event) => removeItem(detail, event)}>
                  <MinusCircle className={styles.removeIcon} />
                </div>
              }
            </div>
          </Link>
        ) : null
      })}
    </div>
  )
}
