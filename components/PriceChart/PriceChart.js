import React from 'react';
import styles from './PriceChart.module.scss';
import { Line } from 'react-chartjs-2';

// Components

// Utility functions

export default function PriceChart({ sales }) {
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
