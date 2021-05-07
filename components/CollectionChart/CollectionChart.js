import React, { useState, useEffect } from 'react';
import styles from './CollectionChart.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import sale from '../../util/api/sales';


export default function CollectionChart({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails);
  const [sales, setSales] = useState({}); // raw sales as an object where the keys are the card_ids


  const getSales = async () => {
    let item_ids = collectionDetails.map(item => item.item_id);
    let allSales = await sale.getForMultiple(item_ids);
    let salesLookup = {};
    allSales.forEach(sale => {
      salesLookup[sale.card_id] = salesLookup[sale.card_id] || [];
      salesLookup[sale.card_id].push(sale);
    })

    setSales(salesLookup);
  }

  useEffect(getSales, [collectionDetails]);

  return (
    <div className={styles.container}>

    </div>
  )
}
