import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';
import FinishButtons from '../FinishButtons/FinishButtons';

// Utility functions
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';

export default function PriceDetails({ card, sales, finishes, setFinishes }) {
  const [selectedFinish, setSelectedFinish] = useState('non-holo');
  const [recentSales, setRecentSales] = useState([]);
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
          // Determine finish: 'non-holo', 'reverse_holo', 'holo'
          let finish = determineFinish(sale.title);
          typeRecord[finish] = typeRecord[finish] || {};

          let finishRef = typeRecord[finish];

          if (sale.grading_authority && sale.grade) { // is a graded card
            // Ex. typeRecord.non-holo.PSA.10 = [all_psa_10_sales_for_regular_finish]
            finishRef[sale.grading_authority] = finishRef[sale.grading_authority] || {};
            finishRef[sale.grading_authority][sale.grade] = finishRef[sale.grading_authority][sale.grade] || [];
            finishRef[sale.grading_authority][sale.grade].push(sale);
          } else { // is ungraded
            finishRef.ungraded = finishRef.ungraded || [];
            finishRef.ungraded.push(sale);
          }
        })

        setSalesByType(typeRecord);
      }
    } catch (error) {
      console.error(error);
    }
  }


  // Finishes - non-holo, reverse_holo, holo
  // Note that finishes are NOT rarity. They simply relate to the finish of the card.
  const determineFinish = (title) => {
    // If the card has explicitly set finishes, override whatever the title says
    if (card.finishes && card.finishes.length > 0) {
      return card.finishes[0];
    } else { // otherwise, determine based on the title like normal
      let finish = 'non-holo';
      title = title.toLowerCase();
      // First check for "reverse holo"
      if (title.includes('reverse')) {
        finish = 'reverse_holo';
      } else if (title.includes('holo') || title.includes('foil')) {
        finish = 'holo';
      }

      return finish;
    }
  }

  const setAvailableFinishes = () => {
    if (finishes.length === 0) {

      if (card.finishes && card.finishes.length > 0) {
        setFinishes(card.finishes);
        setSelectedFinish(card.finishes[0]);
      } else {
        let availableFinishes = Object.keys(salesByType).sort((a, b) => {
          if (salesByType[a].ungraded && salesByType[b].ungraded) {
            if (salesByType[a].ungraded.length > salesByType[b].ungraded.length) {
              return -1;
            } else if (salesByType[a].ungraded.length < salesByType[b].ungraded.length) {
              return 1;
            }
          }
          return 0;
        })
        .filter(finish => Object.keys(salesByType[finish]).length > 0)

        setFinishes(availableFinishes);
        setSelectedFinish(availableFinishes[0]);
      }
    }
  }


  useEffect(sortSalesByType, [sales]);
  useEffect(setAvailableFinishes, [salesByType]);

  return (
    <div className={styles.container}>
      <FinishButtons finishes={finishes} selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish} />
      { salesByType[selectedFinish] &&
        <>
          <PriceBlock sales={salesByType[selectedFinish].ungraded || []} ungraded={true} />
          { salesByType[selectedFinish].PSA && salesByType[selectedFinish].PSA[10] &&
            <PriceBlock sales={salesByType[selectedFinish].PSA && salesByType[selectedFinish].PSA[10] ? salesByType[selectedFinish].PSA[10] : []} gradingAuthority={'PSA'} grade={10} />
          }
        </>
      }

    </div>
  )
}
