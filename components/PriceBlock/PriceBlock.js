import React, { useState, useEffect } from 'react';
import styles from './PriceBlock.module.scss';

// Components

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth } from '../../util/date.js';


export default function PriceBlock({ sales, ungraded, gradingAuthority, grade }) {
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

       recentSales = recentSales.map(sale => {
         let price = sale.price;
         if (sale.currency !== 'USD') {
           return null;
         }
         return price;
       })
       .filter(price => !!price)

       let total = recentSales.reduce((total, current) => {
         total += current;
         return total;
       }, 0)

       let avg = total / recentSales.length;
       avg = Math.round((avg + Number.EPSILON) * 100) / 100;
       console.log('average price ', total, avg);
       setAveragePrice(avg);
     }
  }

  useEffect(findPrice, [sales])
  return (
    <div className={styles.container}>

      <div className={styles.details}>
        <h2 className={styles.price}>${averagePrice}</h2>
        
        { ungraded &&
          <span className={styles.grade}>Ungraded</span>
        }

        { gradingAuthority && grade &&
          <span className={styles.grade}>{gradingAuthority} {grade}</span>
        }
      </div>
    </div>
  )
}
