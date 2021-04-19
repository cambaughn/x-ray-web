import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';
import VariantButtons from '../VariantButtons/VariantButtons';

// Utility functions
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';

export default function PriceDetails({ sales }) {
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState('non-holo');
  const [recentSales, setRecentSales] = useState([])
  const [salesByType, setSalesByType] = useState({});

  const sortSalesByType = async () => {
    try {
      if (sales.length > 0) {
        sales.forEach(sale => {
          sale.date = dateSoldToObject(sale.date_sold);
        })

        let recentSales = sales.filter(sale => isLastThreeMonths(sale.date));

        let typeRecord = {};
        recentSales.forEach(sale => {
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
          { salesByType[selectedVariant].PSA && salesByType[selectedVariant].PSA[10] &&
            <PriceBlock sales={salesByType[selectedVariant].PSA && salesByType[selectedVariant].PSA[10] ? salesByType[selectedVariant].PSA[10] : []} gradingAuthority={'PSA'} grade={10} />
          }
        </>
      }

    </div>
  )
}
