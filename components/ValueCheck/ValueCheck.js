import React, { useState, useEffect } from 'react';
import styles from './ValueCheck.module.scss';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

// Components

// Utility functions
import formattedSale from '../../util/api/formatted_sale.js';
import { lenspath } from '../../util/helpers/object.js';


export default function ValueCheck({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [salesByType, setSalesByType] = useState({});

  const getSales = async () => {
    if (collectionDetails.length > 0 && Object.keys(collectedItems).length > 0) {
      let item_ids = collectionDetails.map(item => item.item_id);
      let allSales = await formattedSale.getForMultiple(item_ids);
      let salesLookup = {};

      // Create sales lookup object to easily switch between different specifics
      allSales.forEach(sale => {
        let specifics = sale.id.split('_');
        let [card_id, finish, grading_authority, grade] = specifics;

        salesLookup[card_id] = salesLookup[card_id] || {}; // this is the finish
        salesLookup[card_id][finish] = salesLookup[card_id][finish] || {}; // this is the finish
        salesLookup[card_id][finish][grading_authority] = salesLookup[card_id][finish][grading_authority] || {}; // this is the grading_authority
        if (grading_authority === 'ungraded') { // if ungraded, this is the final level, place the sale here
          salesLookup[card_id][finish][grading_authority] = sale;
        } else {
          salesLookup[card_id][finish][grading_authority][grade] = sale;
        }
      })

      console.log('sales lookup ', salesLookup);

      setSalesByType(salesLookup);
    }
  }

  const getItemValues = (detail) => {
    let values = [];

    if (detail.item_id) {
      let finish = detail.finish || 'holo'; // determine the finish we should use
      let salesForFinish = lenspath(salesByType, `${detail.item_id}.${finish}`) || {}; // get the sales for that finish (if they exist);
      let formatted_data = lenspath(salesForFinish, `ungraded.formatted_data`) || [];
      let ungradedPrice = formatted_data[formatted_data.length - 2]
      ungradedPrice = ungradedPrice ? ungradedPrice.averagePrice : null;
      values[0] = ungradedPrice;

      console.log(values);
    }
    return ['--', '--', '--'];
  }

  useEffect(getSales, [collectionDetails, collectedItems]);

  // console.log(collectionDetails);
  return (
    <div className={styles.container}>

      { collectionDetails.map((detail, index) => {
        let item = collectedItems[detail.item_id] || {};
        let image_src = null;
        if (item && item.images) {
          image_src = item.images.small || item.images.large;
        }
        let values = getItemValues(detail);

        return (
          <div className={styles.itemRow} key={index}>
            <img src={image_src} className={styles.cardImage} />
            <span className={classNames(styles.detailCell, styles.itemName)}>{item.name}</span>
            <span className={classNames(styles.detailCell, styles.grade)}>{detail.grading_authority && detail.grade ? `${detail.grading_authority} ${detail.grade}` : 'Ungraded'}</span>
            <span className={classNames(styles.detailCell, styles.value)}>${values[0]}</span>
            <span className={classNames(styles.detailCell, styles.value)}>${values[1]}</span>
            <span className={classNames(styles.detailCell, styles.value)}>${values[2]}</span>
          </div>
        )
      })}
    </div>
  )
}
