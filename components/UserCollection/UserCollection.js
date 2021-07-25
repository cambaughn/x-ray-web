import React, { useState, useEffect } from 'react';
import styles from './UserCollection.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components
import CollectionList from '../CollectionList/CollectionList';
import CollectionChart from '../CollectionChart/CollectionChart';
import GettingDataMessage from '../GettingDataMessage/GettingDataMessage';
import UserProfileDetails from '../UserProfileDetails/UserProfileDetails';
import KeyboardShortcuts from '../KeyboardShortcuts/KeyboardShortcuts';
import CollectionUtilityButtons from '../CollectionUtilityButtons/CollectionUtilityButtons';

// Utility functions
// Firebase API
import sale from '../../util/api/sales';
import pokeCard from '../../util/api/card';
import formattedSale from '../../util/api/formatted_sale.js';
import userAPI from '../../util/api/user.js';
import collectedItem from '../../util/api/collection';
// Helpers
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { sortSalesByType, formatSalesForChart } from '../../util/helpers/sales';
import { flatten } from '../../util/helpers/array';
import analytics from '../../util/analytics/segment';


export default function UserCollection({ username, isCurrentUser }) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids

  // State for focused user
  const [focusedUser, setFocusedUser] = useState({});
  const [focusedCollectionDetails, setFocusedCollectionDetails] = useState([]); // array of card ids
  const [focusedCollectedItems, setFocusedCollectedItems] = useState({}); // object with card objects mapped to ids
  // State for sales
  const [salesByType, setSalesByType] = useState({});
  const [relevantSales, setRelevantSales] = useState({}); // collectionDetails mapped by index to correct formattedSales
  const [formattedSales, setFormattedSales] = useState([]); // sales formatted to plugin to chart
  const [averagePrice, setAveragePrice] = useState(0); // price to show in top right of chart
  const [numItemsWithoutSales, setNumItemsWithoutSales] = useState(0); // Determines whether to show getting data message
  const [formattedIndividualSales, setFormattedIndividualSales] = useState({}); // relevantSales, but each array formatted for chart


  // Get whichever user is focused
  const getFocusedUser = async () => {
    if (isCurrentUser) {
      setFocusedUser(user);
    } else {
      let userData = await userAPI.getByUsername(username);
      setFocusedUser(userData);
    }
  }

  // Once we've set the focused user, get the collection details and collected items for focused user
  const getCollectionForUser = async () => {
    if (Object.keys(focusedUser).length > 0) {
      if (isCurrentUser && collectionDetails.length > 0 && Object.keys(collectedItems).length > 0) {
        setFocusedCollectionDetails(collectionDetails);
        setFocusedCollectedItems(collectedItems);
      } else {
        // Get collected items records for focused user
        let item_details = await collectedItem.getForUser(focusedUser.id);
        // Use collected items to make a lookup with the actual items
        let itemsToGet = item_details.map(detail => detail.item_id);
        let items = await pokeCard.getMultiple(itemsToGet);
        let itemLookup = {};
        items.forEach(item => {
          itemLookup[item.id] = item;
        })

        setFocusedCollectionDetails(item_details);
        setFocusedCollectedItems(itemLookup);
      }
    }
  }

  const getSales = async () => {
    if ((isCurrentUser || user.role === 'admin') && focusedCollectionDetails.length > 0 && Object.keys(focusedCollectedItems).length > 0) {
      let item_ids = focusedCollectionDetails.map(item => item.item_id);
      let allSales = await formattedSale.getForMultiple(item_ids);
      let salesLookup = {};

      // Create sales lookup object to easily switch between different specifics
      allSales.forEach(sale => {
        let specifics = sale.id.split('_');
        let [card_id, finish, grading_authority, grade] = specifics;

        salesLookup[card_id] = salesLookup[card_id] || {}; // this is the card
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
    if (Object.keys(salesByType).length > 0) {
      let salesForCollection = focusedCollectionDetails.map(item => findSalesForItem(item));
      // console.log('sales for collection ', salesForCollection);
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


  useEffect(recordPageView, []);
  useEffect(getFocusedUser, [username, user]);
  useEffect(getCollectionForUser, [focusedUser]);
  useEffect(getSales, [focusedCollectionDetails, focusedCollectedItems]);
  useEffect(formatAllSales, [salesByType]);

  return (
    <KeyboardShortcuts sort>
      <div className={styles.container}>

        <UserProfileDetails user={focusedUser} />

        { (isCurrentUser || user.role === 'admin') &&
          <div className={styles.chartWrapper}>
            <CollectionChart averagePrice={averagePrice} formattedSales={formattedSales} />

            {/* { numItemsWithoutSales > 0 &&
              <GettingDataMessage numItemsWithoutSales={numItemsWithoutSales} />
            } */}

            <CollectionUtilityButtons />
          </div>
        }

        <CollectionList user={focusedUser} collectedItems={focusedCollectedItems} collectionDetails={focusedCollectionDetails} isCurrentUser={isCurrentUser} sales={relevantSales} isAdmin={user.role === 'admin'} />
      </div>
    </KeyboardShortcuts>
  )
}
