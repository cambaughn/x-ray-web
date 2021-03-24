import React, { useState, useEffect } from 'react';
import styles from './PriceBlock.module.scss';

// Components
import PriceChart from '../PriceChart/PriceChart';

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth, isLastThreeMonths } from '../../util/date.js';

export default function PriceBlock({ sales, ungraded, gradingAuthority, grade }) {
  const [averagePrice, setAveragePrice] = useState(0);
  const [recentSales, setRecentSales] = useState([]);

  const formatSales = () => {
     if (sales.length) {
       // Get for last three months
       let mostRecentSales = sales.filter(sale => isLastThreeMonths(sale.date));
       setRecentSales(mostRecentSales);

       console.log('mostRecentSales ', mostRecentSales);

       // If there aren't enough recent sales, keep going through the history until you find at least 5, or run out of listings
       // if (recentSales.length < 5) {
       //   for (let i = recentSales.length; i < sortedSalesByDate.length; i++) {
       //     if (recentSales.length < 5) {
       //       recentSales.push(sortedSalesByDate[i]);
       //     }
       //   }
       // }


       let total = mostRecentSales.map(sale => {
         let price = sale.price;

         if (sale.currency !== 'USD') {
           return null;
         }
         return price;
       })
       .filter(price => !!price)
       .reduce((total, current) => {
         total += current;
         return total;
       }, 0);


       let avg = total / mostRecentSales.length;
       avg = avg.toFixed(2);
       console.log(`total sales: ${total}, average price: ${avg}`);
       setAveragePrice(avg || 0);
     }
  }

  useEffect(formatSales, [sales]);

  return (
    <div className={styles.container}>

      <div className={styles.details}>
        <div className={styles.leftSide}>
          { ungraded &&
            <span className={styles.grade}>Ungraded</span>
          }

          { gradingAuthority && grade &&
            <span className={styles.grade}>{gradingAuthority} {grade}</span>
          }

          <span className={styles.period}>last 30 days</span>
        </div>
        <div className={styles.rightSide}>
          <h2 className={styles.price}>${averagePrice}</h2>
        </div>

      </div>

      <PriceChart recentSales={recentSales} />
    </div>
  )
}
