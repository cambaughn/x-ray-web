import React, { useState, useEffect } from 'react';
import styles from './PriceBlock.module.scss';

// Components

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth } from '../../util/date.js';


export default function PriceBlock({ sales }) {
  const [averagePrice, setAveragePrice] = useState(0);

  const findPrice = () => {
     if (sales.length) {
       let recentSales = sales.filter(sale => isLastMonth(sale.date));

       // If there aren't enough recent sales, keep going through the history until you find at least 5, or run out of listings
       // if (recentSales.length < 5) {
       //   for (let i = recentSales.length; i < sortedSalesByDate.length; i++) {
       //     if (recentSales.length < 5) {
       //       recentSales.push(sortedSalesByDate[i]);
       //     }
       //   }
       // }

       sales = sales.map(sale => {
         let price = sale.price;
         if (sale.currency !== 'USD') {
           return null;
         }
         return price;
       })
       .filter(price => !!price)

       let total = sales.reduce((total, current) => {
         total += current;
         return total;
       }, 0)

       let avg = total / sales.length;
       avg = Math.round((avg + Number.EPSILON) * 100) / 100;
       console.log('average price ', total, avg);
       setAveragePrice(averagePrice);
     }
  }

  useEffect(findPrice, [sales])
  return (
    <div className={styles.container}>
      <h2>{averagePrice}</h2>
    </div>
  )
}
