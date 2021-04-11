import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions


export default function PriceChart({ salesData }) {
  const isMobile = () => {
    return window.innerWidth < 1024;
  }

  console.log('isMobile ====>', isMobile());

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
        // height={isMobile() ? 200 : 300}
        // width={isMobile() ? 100 : 700}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: false,
            labels: {
              fontColor: 'white',
              fontSize: 14,
            }
          },
          tooltips: {
            callbacks: {
              label: tooltipItem => `${tooltipItem.xLabel}: $${tooltipItem.yLabel}`,
              title: () => null,
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                    display: false //this will remove only the label
                }
              }
            ]
          }
        }}
      />
    </div>
  )
}
