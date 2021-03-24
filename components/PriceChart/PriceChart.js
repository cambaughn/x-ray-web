import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions
import { getDates, getWeeks, datesAreSameDay, formatWeekLabel } from '../../util/date.js';
import { flatten } from '../../util/array.js';


export default function PriceChart({ recentSales }) {
  const [salesData, setSalesData] = useState([]);

  const formatData = () => {
    // Map out the last 12 weeks as days
    let data = getDates(84);

    // Create sales lookup object to easily get sales for day
    let salesLookup = {};
    recentSales.forEach(sale => {
      let key = `${sale.date.getMonth()}-${sale.date.getDate()}`;
      salesLookup[key] = salesLookup[key] || [];
      salesLookup[key].push(sale.price);
    })

    // Convert dates into useful data objects with date[object] and sales[array]
    data = data.map(date => {
      let key = `${date.getMonth()}-${date.getDate()}`;
      let sales = salesLookup[key] || null;
      // let avg = total / salesForDay.length;
      // avg = Math.round((avg + Number.EPSILON) * 100) / 100;
      //
      // let prevDayPrice = data[index - 1] && data[index - 1].averagePrice ? data[index - 1].averagePrice : 0;
      //
      // day.averagePrice = avg || prevDayPrice;

      return { date, sales }
    })
    .filter(day => !!day.sales)

    // Slice data into weeks
    let weeks = getWeeks(12).map(week => {
      return { weekStart: week, sales: [] }
    })
    let focused = 0;

    data.forEach(day => {
      let focusedWeek = weeks[focused];
      let nextWeek = weeks[focused + 1];

      if (focusedWeek && nextWeek) { // make sure we stop at the end of the array and don't get undefined
        if (day.date >= focusedWeek.weekStart && day.date < nextWeek.weekStart) {
          if (day.sales.length) {
            focusedWeek.sales.push(day.sales);
          }
        } else if (day.date >= nextWeek.weekStart) {
          focused++;
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
