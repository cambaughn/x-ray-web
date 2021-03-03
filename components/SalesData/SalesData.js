import React, { useState, useEffect } from 'react';
import styles from './SalesData.module.scss';

// Components
import sale from '../../util/api/sales';
import { sortSalesByPrice } from '../../util/sorting';

// Utility functions

export default function SalesData({}) {
  const [sales, setSales] = useState([]);

  const getSales = async () => {
    let salesData = await sale.getForCard('swsh4-188');
    salesData = sortSalesByPrice(salesData, 'ascending');
    setSales(salesData);
    console.log('got sales ', salesData);
  }

  useEffect(getSales, []);

  return (
    <div className={styles.container}>
      { sales.map(sale => {
        return (
          <div className={styles.saleWrapper} key={sale.id}>
            <h3>{sale.title}</h3>
            <h4>${sale.price}</h4>
          </div>
        )
      })}
    </div>
  )
}
