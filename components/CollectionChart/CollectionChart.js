import React, { useState, useEffect } from 'react';
import styles from './CollectionChart.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import sale from '../../util/api/sales';
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { sortSalesByType, formatSalesForChart } from '../../util/helpers/sales';
import { flatten } from '../../util/helpers/array';


export default function CollectionChart({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [salesLookup, setSalesLookup] = useState({}); // raw sales as an object where the keys are the card_ids
  const [relevantSales, setRelevantSales] = useState([]); // all relevant sales as one single array
  const [formattedSales, setFormattedSales] = useState([]); // sales formatted to plugin to chart
  const [averagePrice, setAveragePrice] = useState(0); // price to show in top right of chart


  const getSales = async () => {
    if (collectionDetails.length > 0 && Object.keys(collectedItems).length > 0) {
      let item_ids = collectionDetails.map(item => item.item_id);
      let allSales = await sale.getForMultiple(item_ids);
      // Convert date strings on sales into objects
      allSales.forEach(sale => {
        sale.date = dateSoldToObject(sale.date_sold);
      })
      allSales = allSales.filter(sale => isLastThreeMonths(sale.date));

      // Create salesLookup with breakdowns by
      let salesObject = {};
      allSales.forEach(sale => {
        salesObject[sale.card_id] = salesObject[sale.card_id] || [];
        salesObject[sale.card_id].push(sale);
      })

      Object.keys(salesObject).forEach(key => {
        let singleCardSales = salesObject[key];
        salesObject[key] = sortSalesByType(salesObject[key], collectedItems[key].finishes);
      })

      setSalesLookup(salesObject);
    }
  }

  // Get all the necessary sales from the sales lookup object and put them into one single array
  // Accounting for multiple instances of the same card, as well
  const determineRelevantSales = () => {
    if (Object.keys(salesLookup).length > 0 && relevantSales.length === 0) {
      let allSales = [];
      collectionDetails.forEach(item => {
        let salesForFinish = salesLookup[item.item_id][item.finish || 'holo'];
        let keySales;

        if (item.grading_authority && item.grade) {
          keySales = salesForFinish[item.grading_authority][item.grade];
        } else {
          keySales = salesForFinish.ungraded;
        }

        allSales.push(keySales)
      })

      allSales = flatten(allSales);
      setRelevantSales(allSales);
    }
  }

  const formatSales = () => {
    if (relevantSales.length > 0) {
      let formattedData = formatSalesForChart(relevantSales);
      let priceToShow = formattedData[formattedData.length - 1].averagePrice;
      priceToShow = priceToShow.toFixed(2);
      setAveragePrice(priceToShow || 0);
      setFormattedSales(formattedData);
    }
  }

  useEffect(getSales, [collectionDetails]);
  useEffect(determineRelevantSales, [salesLookup]);
  useEffect(formatSales, [relevantSales]);

  return (
    <div className={styles.container}>
      <span>{averagePrice}</span>
    </div>
  )
}
