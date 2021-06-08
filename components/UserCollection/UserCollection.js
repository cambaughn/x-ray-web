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
import analytics from '../../util/analytics/segment';


export default function UserCollection({ username }) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids

  const [salesByType, setSalesByType] = useState({});
  const [relevantSales, setRelevantSales] = useState({}); // collectionDetails mapped by index to correct formattedSales
  const [formattedSales, setFormattedSales] = useState([]); // sales formatted to plugin to chart
  const [averagePrice, setAveragePrice] = useState(0); // price to show in top right of chart
  const [numItemsWithouSales, setNumItemsWithoutSales] = useState(0);

  const [formattedIndividualSales, setFormattedIndividualSales] = useState({}); // relevantSales, but each array formatted for chart

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

      // console.log('sales lookup ', salesLookup);

      setSalesByType(salesLookup);
    }
  }

  const formatAllSales = () => {
    if (Object.keys(salesByType).length > 0 && Object.keys(formattedSales).length === 0) {
      let salesForCollection = collectionDetails.map(item => findSalesForItem(item));
      setRelevantSales(salesForCollection);
      let formatted = [];
      let filteredData = salesForCollection.filter(sales => !!sales).map(sale => sale.formatted_data);
      setNumItemsWithoutSales(salesForCollection.length - filteredData.length); // set num without sales as difference between collection details and filtered sales data;

      filteredData.forEach((data) => {
        data.forEach((week, index) => {
          formatted[index] = formatted[index] || {};
          formatted[index].total = formatted[index].total || 0;
          formatted[index].total += week.averagePrice || 0;
          formatted[index].label = week.label;
        })
      })

      formatted.forEach(week => {
        week.total = week.total.toFixed(2);
      })
      formatted = formatted.slice(formatted.length - 12 ||  0, formatted.length - 1);

      setAveragePrice(formatted[formatted.length - 1].total);
      setFormattedSales(formatted);
    }
  }

  // Get sales for item from salesByType object
  const findSalesForItem = (item) => {
    if (!item.finish) { // set default finish in case it wasn't set
      item.finish = 'holo';
    }

    if (salesByType[item.item_id] && salesByType[item.item_id][item.finish]) {
      if (item.grading_authority && item.grade) {
        return salesByType[item.item_id][item.finish][item.grading_authority] && salesByType[item.item_id][item.finish][item.grading_authority][item.grade] ? salesByType[item.item_id][item.finish][item.grading_authority][item.grade] : null;
      } else {
        return salesByType[item.item_id][item.finish].ungraded;
      }
    } else {
      return null;
    }
  }

  const recordPageView = () => {
    analytics.page({
      userId: user.id,
      category: 'Collection',
      name: 'Collection',
      properties: {
        url: window.location.href,
        path: `/collection`
      }
    });
  }


  useEffect(getSales, [collectionDetails, collectedItems]);
  useEffect(formatAllSales, [salesByType]);

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

      <CollectionList sales={relevantSales} />
    </div>
  )
}
