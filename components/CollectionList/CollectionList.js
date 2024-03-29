import React, { useState, useEffect } from 'react';
import styles from './CollectionList.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';
import { MinusCircle } from 'react-feather';

// Components
import CardImage from '../CardImage/CardImage';

// Utility functions
import collectedItem from '../../util/api/collection';
import { sortCollectionByDate } from '../../util/helpers/sorting';
import { setCollectionDetails } from '../../redux/actionCreators';


export default function CollectionList({ user, collectionDetails, collectedItems, isCurrentUser, sales, isAdmin }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [collectedSets, setCollectedSets] = useState([]);
  const [sortedCollectionDetails, setSortedCollectionDetails] = useState([]);
  const collectionSortOptions = useSelector(state => state.collectionSortOptions);
  const dispatch = useDispatch();

  const removeItem = async(item, event) => {
    if (isCurrentUser) {
      event.stopPropagation();

      await collectedItem.archive(item);
      let collection_details = await collectedItem.getForUser(user.id);
      dispatch(setCollectionDetails(collection_details));
    }
  }

  const mapSets = () => {
    // Get an array of all the sets the user has collected by looking through the cards and building up an object first then turning it into an array
    if (collectionDetails.length > 0 && Object.keys(collectedItems).length > 0) {
      let setMap = {};

      collectionDetails.forEach(detail => {
        let item = collectedItems[detail.item_id];
        setMap[item.set_id] = setMap[item.set_id] || {};
        setMap[item.set_id].id = item.set_id;
        setMap[item.set_id].name = item.set_name;
        setMap[item.set_id].cardCount = setMap[item.set_id].cardCount || 0;
        setMap[item.set_id].cardCount++;
      })

      let setsArray = Object.keys(setMap).map(key => setMap[key]);
      setsArray = setsArray.sort((a, b) => {
        if (a.cardCount > b.cardCount) {
          return -1;
        } else {
          return 1;
        }

        return 0;
      })
      setCollectedSets(setsArray);
    }
  }

  const sortByDateAdded = (items) => {
    let { sortOrder } = collectionSortOptions;
    return sortCollectionByDate(items, sortOrder);
  }

  const sortByValue = (items) => {
    let { sortOrder } = collectionSortOptions;

    let sorted = [ ...items ].sort((a, b) => {
      let aSales = sales[a.id];
      let aPrice = aSales ? aSales.formatted_data[aSales.formatted_data.length - 2].averagePrice : 0;
      let bSales = sales[b.id];
      let bPrice = bSales ? bSales.formatted_data[bSales.formatted_data.length - 2].averagePrice : 0;

      if (sortOrder === 'desc') {
        if (aPrice > bPrice) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (aPrice < bPrice) {
          return -1;
        } else {
          return 1;
        }
      }
    })

    return sorted;
  }

  const sortAlphabetically = (items) => {
    let { sortOrder } = collectionSortOptions;

    let sorted = [ ...items ].sort((a, b) => {
      a = collectedItems[a.item_id];
      b = collectedItems[b.item_id];

      let aName = a && a.name ? a.name.toLowerCase() : null;
      let bName = a && b.name ? b.name.toLowerCase() : null;

      if (sortOrder === 'desc') {
        if (aName < bName) {
          return -1;
        } else {
          return 1;
        }
      } else {
        if (aName > bName) {
          return -1;
        } else {
          return 1;
        }
      }
    })

    return sorted;
  }



  const sortCollectionDetails = () => {
    // Handle sorting collected cards
    let sorted = [ ...collectionDetails ];

    switch (collectionSortOptions.sortBy) {
      case 'date':
        sorted = sortByDateAdded(sorted);
        break;
      case 'value':
        sorted = sortByValue(sorted);
        break;
      case 'alphabetical':
        sorted = sortAlphabetically(sorted);
        break;
      }

    setSortedCollectionDetails(sorted);
  }


  const renderCards = (setId) => {
    // If we're rendering only for a certain set, then filter to only include cards that are in that set
    let cardsToRender = sortedCollectionDetails.map(detail => collectedItems[detail.item_id]);
    // Filter for set
    cardsToRender = setId ? cardsToRender.filter(card => card && card.set_id === setId) : cardsToRender;

    let detailsToRender = sortedCollectionDetails.filter(detail => {
      let item = collectedItems[detail.item_id];
      if (setId) {
        return item && item.set_id === setId;
      }
      return true;
    })
    return (
      <div className={classNames(styles.cardListWrapper, { [styles.leftAlignCards]: setId })}>
        { detailsToRender.map((detail, index) => {
          let item = collectedItems[detail.item_id];
          let salesForItem = sales[detail.id];
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

                {/* <img src={item.images.small} className={styles.thumbnail} /> */}
                <CardImage card={item} size={'small'} />
                <div className={styles.details}>
                  <div className={styles.leftSide}>
                    <span className={classNames(styles.topLine, styles.setName)}>{item.set_name.replace('Black Star ', '')}</span>
                    <span className={styles.cardName}>{item.name}</span>
                  </div>

                  <div className={styles.rightSide}>
                    <span className={classNames(styles.topLine, styles.cardNumber)}>#{item.number}</span>
                    { (isCurrentUser || isAdmin ) &&
                      <span className={classNames({ [styles.price]: true, [styles.priceUp]: changeStatus === 'up', [styles.priceDown]: changeStatus === 'down', [styles.priceFlat]: changeStatus === 'flat' })}>{price !== '--' ? `$${price.toFixed(2)}` : price}</span>
                    }
                  </div>
                </div>
                {/* { isCurrentUser && hoveredItem === index &&
                  <div className={styles.removeButton} onClick={(event) => removeItem(detail, event)}>
                    <MinusCircle className={styles.removeIcon} />
                  </div>
                } */}
              </div>
            </Link>
          ) : null
        })}
      </div>
    )
  }

  useEffect(mapSets, [collectedItems, collectionDetails]);
  useEffect(sortCollectionDetails, [collectedItems, collectionDetails, collectionSortOptions, sales]);
  // useEffect(mapSales, [sales]);

  return (
    <div className={styles.container}>
      { collectionDetails.length === 0 &&
        <span className={styles.emptyCollectionMessage}>Search to find cards and add to your collection</span>
      }

      { collectionSortOptions.groupBySet
        ? (
          <div className={styles.setsList}>
            { collectedSets.map((set, index) => {
              return (
                <div className={styles.setWrapper} key={set.id}>
                  <h3>{set.name}</h3>
                  { renderCards(set.id) }
                </div>
              )
            })}
          </div>
        )
        : renderCards()
      }
    </div>
  )
}
