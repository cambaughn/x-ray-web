import React, { useState, useEffect } from 'react';
import styles from './PriceBlock.module.scss';
import Link from 'next/link';

// Components
import PriceChart from '../PriceChart/PriceChart';

// Utility functions
import { sortSalesByDate } from '../../util/helpers/sorting.js';
import { getDates, getWeeks, formatWeekLabel } from '../../util/helpers/date.js';
import { numberWithCommas } from '../../util/helpers/string.js';
import { flatten } from '../../util/helpers/array.js';


export default function PriceBlock({ sales, label, setViewMode }) {
  const [averagePrice, setAveragePrice] = useState(0);
  const [analysis, setAnalysis] = useState({});


  const analyzeData = () => {
     if (sales.length > 0) {
       // Map out the last 12 weeks as days
       let data = getDates(84);

       let analysisDetails = {
         volume: 0,
         numSales: 0,
         highestPrice: null,
         lowestPrice: null,
       }
       // console.log(sales);
       // Run through each sale to calculate necessary data
       sales.forEach(sale => {
         analysisDetails.volume += sale.total;
         analysisDetails.numSales += sale.sales.length;

         if (!analysisDetails.lowestPrice || sale.lowest_price < analysisDetails.lowestPrice) {
           analysisDetails.lowestPrice = !!sale.lowest_price ? sale.lowest_price : analysisDetails.lowestPrice;
         }

         if (!analysisDetails.highestPrice || sale.highest_price > analysisDetails.highestPrice) {
           analysisDetails.highestPrice = !!sale.highest_price ? sale.highest_price : analysisDetails.highestPrice;
         }
       })

       analysisDetails.volume = analysisDetails.volume.toFixed(2);
       analysisDetails.highestPrice = !!analysisDetails.highestPrice ? analysisDetails.highestPrice.toFixed(2) : 0;
       analysisDetails.lowestPrice = !!analysisDetails.lowestPrice ? analysisDetails.lowestPrice.toFixed(2) : 0;

       setAnalysis(analysisDetails);
     }
  }

  const displayTable = () => {
    return analysis.volume || analysis.highestPrice || analysis.lowestPrice;
  }


  useEffect(analyzeData, [sales]);


  return (
    <div className={styles.container}>

      <div className={styles.chart}>
        <div className={styles.details}>
          <div className={styles.leftSide}>
            <span className={styles.grade}>{label}</span>

            <span className={styles.period}>last 90 days</span>
          </div>
          <div className={styles.rightSide}>
            <h2 className={styles.price}>${sales[sales.length - 2].averagePrice}</h2>
            <span className={styles.period}>avg. last week</span>
          </div>

        </div>

        <PriceChart sales={sales.slice(0, sales.length - 1)} />
      </div>

      { displayTable() &&
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              { analysis.numSales > 0 &&
                <tr>
                  <td className={styles.label}># of Sales:</td>
                  <td className={styles.data}>{analysis.numSales}</td>
                </tr>
              }
              { analysis.volume &&
                <tr>
                  <td className={styles.label}>Total Volume:</td>
                  <td className={styles.data}>${numberWithCommas(analysis.volume)}</td>
                </tr>
              }
              { analysis.highestPrice > 0 &&
                <tr>
                  <td className={styles.label}>Highest Price:</td>
                  <td className={styles.data}>${numberWithCommas(analysis.highestPrice)}</td>
                </tr>
              }
              { analysis.lowestPrice > 0 &&
                <tr>
                  <td className={styles.label}>Lowest Price:</td>
                  <td className={styles.data}>${numberWithCommas(analysis.lowestPrice)}</td>
                </tr>
              }
            </tbody>
          </table>

          {/* <div className={styles.viewSalesWrapper} onClick={() => setViewMode('sales')}>
            <span className={styles.viewSalesText}>View Sales</span>
          </div> */}
        </div>
      }
    </div>
  )
}
