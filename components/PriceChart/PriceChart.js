import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line } from 'react-chartjs-2';

// Components

// Utility functions
import { getDatesForMonth, datesAreSameDay, formatDateLabelForChart } from '../../util/date.js';

export default function PriceChart({ recentSales }) {
  const [salesData, setSalesData] = useState([]);

  const formatData = () => {
    // console.log(recentSales);
    // Map out the last thirty-one days
    let data = getDatesForMonth();

    // Convert dates into useful data objects with date[object] and label[string]
    data = data.map(date => {
      let label = formatDateLabelForChart(date);
      return { date, label }
    })

    let salesLookup = {};
    // console.log(recentSales);
    recentSales.forEach(sale => {
      let key = `${sale.date.getMonth()}-${sale.date.getDay()}`
      salesLookup[key] = salesLookup[key] || [];
      salesLookup[key].push(sale.price);
    })

    data.forEach(day => {
      let key = `${day.date.getMonth()}-${day.date.getDay()}`;
      let sales = salesLookup[key];

      // console.log(key, sales);
    })

    // Add average sale price for that day
    console.log('data => ', data, salesLookup);
  }

  useEffect(formatData, [recentSales])

  return (
    <div className={styles.container}>
      <Line
        data={{
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: 'Price (USD)',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: ['rgba(70, 130, 180, 0.3)', 'rgba(70, 130, 180, 0)'],
              borderColor: '#4682b4',
              borderWidth: 2,
            }
          ]
        }}
        height={400}
        width={900}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            labels: {
              fontColor: 'white',
              fontSize: 14,
            }
          }
        }}
      />
    </div>
  )
}
