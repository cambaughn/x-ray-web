import React, { useState, useEffect } from 'react';
import styles from './UserCollection.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components
import CollectionList from '../CollectionList/CollectionList';
import CollectionChart from '../CollectionChart/CollectionChart';
import GettingDataMessage from '../GettingDataMessage/GettingDataMessage';

// Utility functions
import sale from '../../util/api/sales';
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { sortSalesByType, formatSalesForChart } from '../../util/helpers/sales';
import { flatten } from '../../util/helpers/array';
import formattedSale from '../../util/api/formatted_sale.js';


export default function UserCollection({ username }) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [salesByType, setSalesByType] = useState({});

  const [relevantSales, setRelevantSales] = useState({}); // salesLookup reduced to only relevant sales
  const [formattedIndividualSales, setFormattedIndividualSales] = useState({}); // relevantSales, but each array formatted for chart
  const [formattedSales, setFormattedSales] = useState([]); // sales formatted to plugin to chart
  const [averagePrice, setAveragePrice] = useState(0); // price to show in top right of chart
  const [numItemsWithouSales, setNumItemsWithoutSales] = useState(0);

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

  // Get all the necessary sales from the sales lookup object and put them into a new object
  const determineRelevantSales = () => {
    if (Object.keys(salesLookup).length > 0 && Object.keys(relevantSales).length === 0) {
      let newRelevantSales = {};
      let withoutSalesCount = 0;

      collectionDetails.forEach(item => {
        let salesForItem = salesLookup[item.item_id] || { holo: [] };
        let salesForFinish = item.finish ? salesForItem[item.finish] : salesForItem[Object.keys(salesForItem).includes('holo') ? 'holo' : Object.keys(salesForItem)[0]];
        let keySales = [];

        if (item.grading_authority && item.grade) {
          keySales = salesForFinish[item.grading_authority][item.grade] || [];
        } else {
          keySales = salesForFinish.ungraded || [];
        }

        if (keySales.length === 0) {
          withoutSalesCount++;
        }

        newRelevantSales[item.item_id] = keySales;
      })

      setNumItemsWithoutSales(withoutSalesCount);
      setRelevantSales(newRelevantSales);
    }
  }

  const formatIndividualItemSales = () => {
    if (Object.keys(formattedIndividualSales).length === 0 && Object.keys(relevantSales).length > 0) {
      let individualSales = {};
      Object.keys(relevantSales).forEach(key => {
        let focusedSales = relevantSales[key];
        let formattedData = formatSalesForChart(focusedSales);
        individualSales[key] = formattedData;
      })

      setFormattedIndividualSales(individualSales);
    }
  }

  // Take the formatted sales for each card and put them into one array to pass to the chart
  const finalFormatSales = () => {
    if (Object.keys(formattedIndividualSales).length > 0 && formattedSales.length === 0) {
      let formattedData = [];
      if (collectionDetails[0]) {
        formattedData = formattedIndividualSales[collectionDetails[0].item_id];
        formattedData = formattedData.map(data => {
          let blankData = {
            label: data.label,
            itemSales: []
          };
          return blankData;
        })
      }

      // Add average price for each week (for each item) to the itemSales in formatted data
      collectionDetails.forEach(item => {
        let formatted = formattedIndividualSales[item.item_id];
        formatted.forEach((week, index) => {
          formattedData[index].itemSales.push(week.averagePrice);
        })
      })

      formattedData.forEach(week => {
        week.total = week.itemSales.reduce((a, b) => a + b).toFixed(2);
      })

      let priceToShow = formattedData[formattedData.length - 1].total;
      setAveragePrice(priceToShow || 0);
      setFormattedSales(formattedData);
    }
  }

  useEffect(getSales, [collectionDetails, collectedItems]);
  // useEffect(determineRelevantSales, [salesLookup]);
  // useEffect(formatIndividualItemSales, [relevantSales]);
  // useEffect(finalFormatSales, [formattedIndividualSales]);

  return (
    <div className={styles.container}>

      <div className={styles.profileDetails}>
        <h3 className={styles.name}>{user.name}</h3>
        <span className={styles.username}>@{user.username}</span>
      </div>

      <CollectionChart averagePrice={averagePrice} formattedSales={formattedSales} />

      { numItemsWithouSales > 0 &&
        <GettingDataMessage numItemsWithouSales={numItemsWithouSales} />
      }

      <CollectionList />
    </div>
  )
}
