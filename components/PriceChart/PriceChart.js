import React, { useState, useEffect } from 'react';
import styles from './PriceChart.module.scss';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions


export default function PriceChart({ sales }) {

  const isMobile = () => {
    return window.innerWidth < 1024;
  }

  return (
    <div className={styles.container}>
      <Line
        data={{
          labels: sales.map(week => week.label),
          datasets: [
            {
              label: 'Price (USD)',
              data: sales.map(week => week.averagePrice),
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
  )
}
