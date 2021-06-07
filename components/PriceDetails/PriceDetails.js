import React, { useState, useEffect } from 'react';
import styles from './PriceDetails.module.scss';

// Components
import PriceBlock from '../PriceBlock/PriceBlock';
import FinishButtons from '../FinishButtons/FinishButtons';
import NoDataMessage from '../NoDataMessage/NoDataMessage';

// Utility functions
import { isLastThreeMonths, dateSoldToObject } from '../../util/helpers/date.js';
import { unique } from '../../util/helpers/array.js';
import formattedSale from '../../util/api/formatted_sale.js';


export default function PriceDetails({ card, finishes, setFinishes }) {
  const [selectedFinish, setSelectedFinish] = useState('non-holo');
  const [salesByType, setSalesByType] = useState({});
  const [gotSales, setGotSales] = useState(false);

  const getSales = async () => {
    try {
      if (card.id) {
        let sales = await formattedSale.getForItem(card.id);
        let availableFinishes = [];
        let salesLookup = {};

        // Create sales lookup object to easily switch between different specifics
        sales.forEach(sale => {
          // utilize finish to set available finishes
          availableFinishes.push(sale.finish);
          let specifics = sale.id.split('_').slice(1);
          let [finish, grading_authority, grade] = specifics;

          salesLookup[finish] = salesLookup[finish] || {}; // this is the finish
          salesLookup[finish][grading_authority] = salesLookup[finish][grading_authority] || {}; // this is the grading_authority
          if (grading_authority === 'ungraded') { // if ungraded, this is the final level, place the sale here
            salesLookup[finish][grading_authority] = sale;
          } else {
            salesLookup[finish][grading_authority][grade] = sale;
          }

        })

        availableFinishes = unique(availableFinishes);
        setSelectedFinish(availableFinishes[0]);
        setFinishes(availableFinishes);
        setSalesByType(salesLookup);
        setGotSales(true);
      }
    } catch (error) {
      console.error(error);
    }
  }



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

  // Finishes - non-holo, reverse_holo, holo
  // Note that finishes are NOT rarity. They simply relate to the finish of the card.
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


  useEffect(getSales, [card]);


  return (
    <div className={styles.container}>
      <FinishButtons finishes={finishes} selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish} />
      { salesByType[selectedFinish] &&
        <>
          <PriceBlock sales={salesByType[selectedFinish].ungraded.formatted_data || []} label={'Ungraded'} />
          { salesByType[selectedFinish]['PSA'] && salesByType[selectedFinish]['PSA']['10'] &&
            <PriceBlock sales={salesByType[selectedFinish]['PSA']['10'].formatted_data || []} label={'PSA 10'} />
          }
        </>
      }

      { gotSales && !salesByType[selectedFinish] &&
        <NoDataMessage />
      }

    </div>
  )
}
