import React, { useState, useEffect } from 'react';
import styles from './CollectionChart.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { Line, defaults } from 'react-chartjs-2';

// Components

// Utility functions
import sale from '../../util/api/sales';
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { sortSalesByType, formatSalesForChart } from '../../util/helpers/sales';
import { flatten } from '../../util/helpers/array';


export default function CollectionChart({}) {
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails); // array of card ids
  const collectedItems = useSelector(state => state.collectedItems); // object with card objects mapped to ids
  const [salesLookup, setSalesLookup] = useState({}); // raw sales as an object where the keys are the card_ids
  const [relevantSales, setRelevantSales] = useState({}); // salesLookup reduced to only relevant sales
  const [formattedIndividualSales, setFormattedIndividualSales] = useState({}); // relevantSales, but each array formatted for chart
  const [formattedSales, setFormattedSales] = useState([]); // sales formatted to plugin to chart
  const [averagePrice, setAveragePrice] = useState(0); // price to show in top right of chart


  const getSales = async () => {
    if (collectionDetails.length > 0 && Object.keys(collectedItems).length > 0) {
      let item_ids = collectionDetails.map(item => item.item_id);
      let allSales = await sale.getForMultiple(item_ids);
      // Convert date strings on sales into objects
      allSales.forEach(sale => {
        sale.date = dateSoldToObject(sale.date_sold);
      })
      allSales = allSales.filter(sale => isLastThreeMonths(sale.date));

      // Create salesLookup with breakdowns by
      let salesObject = {};
      allSales.forEach(sale => {
        salesObject[sale.card_id] = salesObject[sale.card_id] || [];
        salesObject[sale.card_id].push(sale);
      })

      Object.keys(salesObject).forEach(key => {
        let singleCardSales = salesObject[key];
        salesObject[key] = sortSalesByType(salesObject[key], collectedItems[key].finishes);
      })

      console.log('getting sales', salesObject);

      setSalesLookup(salesObject);
    }
  }

  // Get all the necessary sales from the sales lookup object and put them into a new object
  const determineRelevantSales = () => {
    if (Object.keys(salesLookup).length > 0 && Object.keys(relevantSales).length === 0) {
      let newRelevantSales = {};

      collectionDetails.forEach(item => {
        let salesForItem = salesLookup[item.item_id];
        let salesForFinish = item.finish ? salesForItem[item.finish] : salesForItem[Object.keys(salesForItem).includes('holo') ? 'holo' : Object.keys(salesForItem)[0]];
        let keySales;

        if (item.grading_authority && item.grade) {
          keySales = salesForFinish[item.grading_authority][item.grade];
        } else {
          keySales = salesForFinish.ungraded;
        }

        newRelevantSales[item.item_id] = keySales;
      })

      // console.log('allsales ', newRelevantSales);
      setRelevantSales(newRelevantSales);
    }
  }

  const formatIndividualItemSales = () => {
    if (Object.keys(formattedIndividualSales).length === 0 && Object.keys(relevantSales).length > 0) {
      let individualSales = {};
      Object.keys(relevantSales).forEach(key => {
        let focusedSales = relevantSales[key];
        let formattedData = formatSalesForChart(focusedSales);
        individualSales[key] = formattedData;
      })

      setFormattedIndividualSales(individualSales);
    }
  }

  // Take the formatted sales for each card and put them into one array to pass to the chart
  const finalFormatSales = () => {
    if (Object.keys(formattedIndividualSales).length > 0 && formattedSales.length === 0) {
      let formattedData = [];
      if (collectionDetails[0]) {
        formattedData = formattedIndividualSales[collectionDetails[0].item_id];
        formattedData = formattedData.map(data => {
          let blankData = {
            label: data.label,
            itemSales: []
          };
          return blankData;
        })
      }

      // Add average price for each week (for each item) to the itemSales in formatted data
      collectionDetails.forEach(item => {
        let formatted = formattedIndividualSales[item.item_id];
        formatted.forEach((week, index) => {
          formattedData[index].itemSales.push(week.averagePrice);
        })
      })

      formattedData.forEach(week => {
        week.total = week.itemSales.reduce((a, b) => a + b).toFixed(2);
      })

      console.log('formatted Data ', formattedData);

      let priceToShow = formattedData[formattedData.length - 1].total;
      setAveragePrice(priceToShow || 0);
      setFormattedSales(formattedData);
    }
  }

  useEffect(getSales, [collectionDetails, collectedItems]);
  useEffect(determineRelevantSales, [salesLookup]);
  useEffect(formatIndividualItemSales, [relevantSales]);
  useEffect(finalFormatSales, [formattedIndividualSales]);

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
          <span className={styles.period}>avg. last week</span>
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
