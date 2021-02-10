import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth } from '../../util/date.js';

export default function PriceDetails({ sales }) {
  const [salesByType, setSalesByType] = useState({});

  const findPrice = async () => {
    try {
      if (sales.length > 0) {
        let typeRecord = {};
        sales.forEach(sale => {
          sale.date = Date.parse(sale.date_sold);

          if (sale.grading_authority && sale.grade) { // is a graded card
            // Ex. typeRecord.PSA.10 = [all_psa_10_sales]
            typeRecord[sale.grading_authority] = typeRecord[sale.grading_authority] || {};
            typeRecord[sale.grading_authority][sale.grade] = typeRecord[sale.grading_authority][sale.grade] || [];
            typeRecord[sale.grading_authority][sale.grade].push(sale);
          } else { // is ungraded
            typeRecord.ungraded = typeRecord.ungraded || [];
            typeRecord.ungraded.push(sale);
          }
        })

        setSalesByType(typeRecord);

        // TODO: Figure out how to filter based on recency. Maybe that just happens in the PriceBlock component below

        // let sortedSalesByDate = sortSalesByDate(salesForGrade);

      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(findPrice, [sales]);

  return (
    <div className={styles.container}>
      <PriceBlock sales={salesByType.ungraded} />
      {/* <PriceBlock /> */}
    </div>
  )
}
