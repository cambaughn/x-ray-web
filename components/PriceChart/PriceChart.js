import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line, defaults } from 'react-chartjs-2';

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

    // Create sales lookup object to easily get sales for day
    let salesLookup = {};
    recentSales.forEach(sale => {
      let key = `${sale.date.getMonth()}-${sale.date.getDay()}`
      salesLookup[key] = salesLookup[key] || [];
      salesLookup[key].push(sale.price);
    })

    // Find and add average sale price for that day
    data.forEach((day, index) => {
      let key = `${day.date.getMonth()}-${day.date.getDay()}`;
      let salesForDay = salesLookup[key] || [];
      let total = 0;
      salesForDay.forEach(sale => {
        total += sale;
      })
      let avg = total / salesForDay.length;
      avg = Math.round((avg + Number.EPSILON) * 100) / 100;

      let prevDayPrice = data[index - 1] && data[index - 1].averagePrice ? data[index - 1].averagePrice : 0;

      day.averagePrice = avg || prevDayPrice;
    })

    // console.log('data => ', data);

    setSalesData(data)
  }

  useEffect(formatData, [recentSales])

  return (
    <div className={styles.container}>
      <Line
        data={{
          labels: salesData.map(day => day.label),
          datasets: [
            {
              label: 'Price (USD)',
              data: salesData.map(day => day.averagePrice),
              backgroundColor: ['rgba(70, 130, 180, 0.3)', 'rgba(70, 130, 180, 0)'],
              borderColor: '#4682b4',
              borderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 10,
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
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }}
      />
    </div>
  )
}
