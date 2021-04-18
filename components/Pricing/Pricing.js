import React, { useState, useEffect } from 'react';
import styles from './Pricing.module.scss';


// Components

// Utility functions


export default function Pricing({ sales }) {
  const [price, setPrice] = useState(null);
  const [grade, setGrade] = useState('ungraded');
  const [priceChange, setPriceChange] = useState(null);

  const formatSales = async () => {
    try {
      if (sales.length > 0) {
        let grade = null;
        let grading_authority = 'PSA';
        let salesForGrade = grade ? sales.filter(sale => {
          return sale.grade === grade && sale.grading_authority === grading_authority;
        }) : sales.filter(sale => !sale.grade);

        salesForGrade = salesForGrade.map(sale => {
          sale.date = Date.parse(sale.date_sold);
          return sale;
        });

        let sortedSalesByDate = sortSalesByDate(salesForGrade);
        let recentSales = sortedSalesByDate.filter(sale => isLastMonth(sale.date));

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

        let averagePrice = total / recentSales.length;
        averagePrice = Math.round((averagePrice + Number.EPSILON) * 100) / 100;
        // console.log('average price ', total, averagePrice);
        setPrice(averagePrice);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(formatSales, [sales]);

  return (
    <div className={styles.container}>
      { price &&
        <>
          <h3 className={styles.price}>${price}</h3>
          <span className={styles.grade}>{grade}</span>
        </>
      }
      { priceChange &&
        <span className={styles.priceChange}>+$15 (10%)</span>
      }
    </div>
  )
}
