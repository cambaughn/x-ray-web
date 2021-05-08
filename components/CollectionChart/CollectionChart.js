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
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [sales, setSales] = useState({}); // raw sales as an object where the keys are the card_ids
  const [numItems, setNumItems] = useState({}); // Object with card_id: number of cards


  const getSales = async () => {
    let item_ids = collectionDetails.map(item => item.item_id);
    let allSales = await sale.getForMultiple(item_ids);
    // Convert date strings on sales into objects
    allSales.forEach(sale => {
      sale.date = dateSoldToObject(sale.date_sold);
    })
    allSales = allSales.filter(sale => isLastThreeMonths(sale.date));

    // Create salesLookup with breakdowns by
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

  // Get all the necessary sales from the sales lookup object and put them into one single array
  const determineRelevantSales = () => {

  }


  const findNumItems = () => {
    let numTracker = {};
    collectionDetails.forEach(item => {
      numTracker[item.item_id] = numTracker[item.item_id] || 0;
      numTracker[item.item_id]++;
    })

    setNumItems(numTracker);
  }

  useEffect(getSales, [collectionDetails]);
  useEffect(findNumItems, [collectionDetails]);
  useEffect(determineRelevantSales, [sales]);

  return (
    <div className={styles.container}>

    </div>
  )
}
