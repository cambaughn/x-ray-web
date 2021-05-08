import React, { useState, useEffect } from 'react';
import styles from './CollectionChart.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import sale from '../../util/api/sales';
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { sortSalesByType } from '../../util/helpers/sales';


export default function CollectionChart({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails);
  const collectedItems = useSelector(state => state.collectedItems);
  const [sales, setSales] = useState({}); // raw sales as an object where the keys are the card_ids

  const getSales = async () => {
    let item_ids = collectionDetails.map(item => item.item_id);
    let allSales = await sale.getForMultiple(item_ids);
    // Convert date strings on sales into objects
    allSales.forEach(sale => {
      sale.date = dateSoldToObject(sale.date_sold);
    })
    allSales = allSales.filter(sale => isLastThreeMonths(sale.date));

    let salesLookup = {};
    allSales.forEach(sale => {
      salesLookup[sale.card_id] = salesLookup[sale.card_id] || [];
      salesLookup[sale.card_id].push(sale);
    })

    Object.keys(salesLookup).forEach(key => {
      let singleCardSales = salesLookup[key];
      salesLookup[key] = sortSalesByType(salesLookup[key], collectedItems[key].finishes);
    })

    setSales(salesLookup);
  }

  useEffect(getSales, [collectionDetails]);

  return (
    <div className={styles.container}>

    </div>
  )
}
