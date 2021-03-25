import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions


export default function PriceChart({ salesData }) {


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
