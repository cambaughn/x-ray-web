import React, { useState, useEffect } from 'react';
import styles from './PriceBlock.module.scss';

// Components
import PriceChart from '../PriceChart/PriceChart';

// Utility functions
import { sortSalesByDate } from '../../util/helpers/sorting.js';
import { getDates, getWeeks, formatWeekLabel } from '../../util/helpers/date.js';
import { flatten } from '../../util/helpers/array.js';


export default function PriceBlock({ sales, ungraded, gradingAuthority, grade }) {
  const [averagePrice, setAveragePrice] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [analysis, setAnalysis] = useState({});

  const formatSales = () => {
     if (sales.length > 0) {
       // Map out the last 12 weeks as days
       let data = getDates(84);

       let analysisDetails = {
         volume: 0,
         numSales: 0,
         highestPrice: null,
         lowestPrice: null,
       }

       // Create sales lookup object to easily get sales for day
       let salesLookup = {};
       sales.forEach(sale => {
         let key = `${sale.date.getMonth()}-${sale.date.getDate()}`;
         salesLookup[key] = salesLookup[key] || [];
         salesLookup[key].push(sale.price);

         analysisDetails.volume += sale.price;
         analysisDetails.numSales += 1;

         if (!analysisDetails.lowestPrice || sale.price < analysisDetails.lowestPrice) {
           analysisDetails.lowestPrice = sale.price;
         }

         if (!analysisDetails.highestPrice || sale.price > analysisDetails.highestPrice) {
           analysisDetails.highestPrice = sale.price;
         }
       })

       analysisDetails.volume = analysisDetails.volume.toLocaleString(undefined, { maximumFractionDigits: 2 });
       analysisDetails.highestPrice = analysisDetails.highestPrice.toLocaleString(undefined, { maximumFractionDigits: 2 });
       analysisDetails.lowestPrice = analysisDetails.lowestPrice.toLocaleString(undefined, { maximumFractionDigits: 2 });

       // Convert dates into useful data objects with date[object] and sales[array]
       data = data.map(date => {
         let key = `${date.getMonth()}-${date.getDate()}`;
         let sales = salesLookup[key] || null;
         return { date, sales }
       })
       .filter(day => !!day.sales)

       // Slice data into weeks
       let weeks = getWeeks(12).map(week => {
         return { weekStart: week, sales: [] }
       })

       weeks.forEach((week, index) => {
         let nextWeek = weeks[index + 1] || null;

         if (nextWeek) {
           for (let i = 0; i < data.length; i) {
             let day = data[i];

            if (day.date >= week.weekStart && day.date < nextWeek.weekStart) {
              week.sales.push(data.splice(i, 1)[0].sales)
            } else {
              i++;
            }
           }

         }
       })

       let prevWeekPrice = 0;

       let formattedWeeks = weeks.map((week, index) => {
         if (weeks[index + 1]) {
           let label = formatWeekLabel(week.weekStart, weeks[index + 1].weekStart);
           let sales = flatten(week.sales);

           let total = sales.reduce((a, b) => {
             return a + b;
           }, 0);

           // Determine average
           let avg = total / sales.length;
           avg = Math.round((avg + Number.EPSILON) * 100) / 100;
           let averagePrice = avg || prevWeekPrice;
           prevWeekPrice = averagePrice;

           return { label, sales, total, averagePrice }
         }

         return null;
       })
       .filter(week => !!week)

       setSalesData(formattedWeeks)
       setAnalysis(analysisDetails);

       let priceToShow = formattedWeeks[formattedWeeks.length - 1].averagePrice;
       priceToShow = priceToShow.toFixed(2);
       // console.log(`total sales: ${total}, average price: ${priceToShow}`);
       setAveragePrice(priceToShow || 0);
     }
  }

  const displayTable = () => {
    return analysis.volume || analysis.highestPrice || analysis.lowestPrice;
  }


  useEffect(formatSales, [sales]);

  return (
    <div className={styles.container}>

      <div className={styles.chart}>
        <div className={styles.details}>
          <div className={styles.leftSide}>
            { ungraded &&
              <span className={styles.grade}>Ungraded</span>
            }

            { gradingAuthority && grade &&
              <span className={styles.grade}>{gradingAuthority} {grade}</span>
            }

            <span className={styles.period}>last 90 days</span>
          </div>
          <div className={styles.rightSide}>
            <h2 className={styles.price}>${averagePrice}</h2>
            <span className={styles.period}>avg. last week</span>
          </div>

        </div>

        <PriceChart salesData={salesData} />
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
                  <td className={styles.data}>${analysis.volume}</td>
                </tr>
              }
              { analysis.highestPrice &&
                <tr>
                  <td className={styles.label}>Highest Price:</td>
                  <td className={styles.data}>${analysis.highestPrice}</td>
                </tr>
              }
              { analysis.lowestPrice &&
                <tr>
                  <td className={styles.label}>Lowest Price:</td>
                  <td className={styles.data}>${analysis.lowestPrice}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}
