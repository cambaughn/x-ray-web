import React, { useState, useEffect } from 'react';
import styles from './SalesData.module.scss';

// Components
import sale from '../../util/api/sales';

// Utility functions

export default function SalesData({}) {
  const [sales, setSales] = useState([]);

  const getSales = async () => {
    let salesData = await sale.getForCard('swsh4-188');
    setSales(salesData);
  }

  useEffect(getSales, []);

  return (
    <div className={styles.container}>
      dslkfjdslkfjkl
    </div>
  )
}
