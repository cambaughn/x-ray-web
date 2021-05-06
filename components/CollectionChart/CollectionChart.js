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
    console.log('collected items ', allSales);

    // setSales(allSales)
  }

  useEffect(getSales, [collectionDetails]);

  return (
    <div className={styles.container}>

    </div>
  )
}
