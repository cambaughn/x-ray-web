import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';
import VariantButtons from '../VariantButtons/VariantButtons';

// Utility functions
import { sortSalesByDate } from '../../util/sorting.js';
import { isLastMonth, dateSoldToObject } from '../../util/date.js';

export default function PriceDetails({ sales }) {
  const [selectedVariant, setSelectedVariant] = useState('non-holo');
  const [salesByType, setSalesByType] = useState({});
  const [variants, setVariants] = useState([]);

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


  // Variants - non-holo, reverse_holo, holo
  // Note that variants are NOT rarity. They simply relate to the finish of the card.
  const determineVariant = (title) => {
    let variant = 'non-holo';
    title = title.toLowerCase();
    // First check for "reverse holo"
    if (title.includes('reverse')) {
      variant = 'reverse_holo';
    } else if (title.includes('holo') || title.includes('foil')) {
      variant = 'holo';
    }

    return variant;
  }

  const setAvailableVariants = () => {
    if (variants.length === 0) {
      let availableVariants = Object.keys(salesByType).sort((a, b) => {
        if (salesByType[a].ungraded && salesByType[b].ungraded) {
          if (salesByType[a].ungraded.length > salesByType[b].ungraded.length) {
            return -1;
          } else if (salesByType[a].ungraded.length < salesByType[b].ungraded.length) {
            return 1;
          }
        }
        return 0;
      })
      .filter(variant => Object.keys(salesByType[variant]).length > 0)

      console.log(availableVariants);
      setVariants(availableVariants);
      setSelectedVariant(availableVariants[0]);
    }
  }

  useEffect(sortSalesByType, [sales]);
  useEffect(setAvailableVariants, [salesByType]);

  return (
    <div className={styles.container}>
      <VariantButtons variants={variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} />
      { salesByType[selectedVariant] &&
        <>
          <PriceBlock sales={salesByType[selectedVariant].ungraded || []} ungraded={true} />
          <PriceBlock sales={salesByType[selectedVariant].PSA && salesByType[selectedVariant].PSA[10] ? salesByType[selectedVariant].PSA[10] : []} gradingAuthority={'PSA'} grade={10} />
        </>
      }

    </div>
  )
}
