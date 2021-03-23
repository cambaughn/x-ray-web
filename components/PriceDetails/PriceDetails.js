import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth, dateSoldToObject } from '../../util/date.js';

export default function PriceDetails({ sales }) {
  const [salesByType, setSalesByType] = useState({});
  const [variants, setVariants] = useState({});

  const sortSalesByType = async () => {
    try {
      if (sales.length > 0) {
        let typeRecord = {};
        sales.forEach(sale => {
          sale.date = dateSoldToObject(sale.date_sold);

          // Determine variant: 'regular', 'reverse_holo', 'holo'
          let variant = determineVariant(sale.title);
          typeRecord[variant] = typeRecord[variant] || {};

          let variantRef = typeRecord[variant];

          if (sale.grading_authority && sale.grade) { // is a graded card
            // Ex. typeRecord.regular.PSA.10 = [all_psa_10_sales_for_regular_variant]
            variantRef[sale.grading_authority] = variantRef[sale.grading_authority] || {};
            variantRef[sale.grading_authority][sale.grade] = variantRef[sale.grading_authority][sale.grade] || [];
            variantRef[sale.grading_authority][sale.grade].push(sale);
          } else { // is ungraded
            variantRef.ungraded = variantRef.ungraded || [];
            variantRef.ungraded.push(sale);
          }
        })

        setSalesByType(typeRecord);
        console.log(typeRecord);
      }
    } catch (error) {
      console.error(error);
    }
  }


  // Variants - regular, reverse_holo, holo
  // Note that variants are NOT rarity. They simply relate to the finish of the card.
  const determineVariant = (title) => {
    let variant = 'regular';
    title = title.toLowerCase();
    // First check for "reverse holo"
    if (title.includes('reverse')) {
      variant = 'reverse_holo';
    } else if (title.includes('holo')) {
      variant = 'holo';
    }

    return variant;
  }

  useEffect(sortSalesByType, [sales]);

  return (
    <div className={styles.container}>
      <PriceBlock sales={salesByType.ungraded || []} ungraded={true} />
      <PriceBlock sales={salesByType.PSA && salesByType.PSA[10] ? salesByType.PSA[10] : []} gradingAuthority={'PSA'} grade={10} />
    </div>
  )
}
