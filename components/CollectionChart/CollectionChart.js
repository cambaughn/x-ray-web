import React, { useState, useEffect } from 'react';
import styles from './CollectionChart.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions

export default function CollectionChart({ averagePrice, formattedSales }) {
  const user = useSelector(state => state.user);

  const isMobile = () => {
    return window.innerWidth < 1024;
  }

  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <div className={styles.leftSide}>
          <span className={styles.grade}>Collection</span>

          {/* { gradingAuthority && grade &&
            <span className={styles.grade}>{gradingAuthority} {grade}</span>
          } */}

          <span className={styles.period}>last 90 days</span>
        </div>
        <div className={styles.rightSide}>
          <h2 className={styles.price}>${averagePrice}</h2>
          <span className={styles.period}>last week</span>
        </div>

      </div>

      <div className={styles.chartWrapper}>
        <Line
          data={{
            labels: formattedSales.map(week => week.label),
            datasets: [
              {
                label: 'Price (USD)',
                data: formattedSales.map(week => week.total),
                backgroundColor: ['rgba(70, 130, 180, 0.3)', 'rgba(70, 130, 180, 0)'],
                borderColor: '#4682b4',
                borderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
              }
            ]
          }}
          // height={isMobile() ? 200 : 300}
          // width={isMobile() ? 100 : 700}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              display: false,
              labels: {
                fontColor: 'white',
                fontSize: 14,
              }
            },
            tooltips: {
              mode: 'x-axis',
              callbacks: {
                label: tooltipItem => `${tooltipItem.xLabel}: $${tooltipItem.yLabel}`,
                title: () => null,
              }
            },
            scales: {
              yAxes: [
                {
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  ticks: {
                    beginAtZero: true,
                    // display: !isMobile() ? true : false
                  }
                }
              ],
              xAxes: [
                {
                  gridLines: {
                    color: 'rgba(0, 0, 0, 0)',
                  },
                  ticks: {
                    display: false //this will remove only the label
                  }
                }
              ]
            }
          }}
        />
      </div>
    </div>
  )
}
