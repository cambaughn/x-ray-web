import React, { useState, useEffect } from 'react';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';
import PriceDetails from '../PriceDetails/PriceDetails';

// Utility functions
import pokeCard from '../../util/api/card';
import pokeSet from '../../util/api/set';
import { getSalesForCard } from '../../util/api/sales';

export default function CardDetails({ card_id }) {
  const [card, setCard] = useState({});
  const [sales, setSales] = useState([]);
  const [set, setSet] = useState({});


  const getCardDetails = async () => {
    try {
      let cardData = await pokeCard.get(card_id);
      let salesData = await getSalesForCard(card_id);
      let setData = await pokeSet.get(cardData.set_id);
      console.log('got set data ', setData);
      console.log('got sales data ', salesData);

      setCard(cardData);
      setSales(salesData || []);

      if (!Array.isArray(setData)) {
        setSet(setData);
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(getCardDetails, [card_id]);

  return (
    <div className={styles.container}>
      <div className={styles.leftRail}>
        <div className={styles.imageWrapper}>
          { card.images && card.images.small &&
            <img src={card.images.small} className={styles.image} />
          }
        </div>

        <h3 className={styles.cardName}>{card.name}</h3>

        { card.name &&
          <div className={styles.tags}>
            <Tag text={`${card.number}/${set.printedTotal}`} color={'#2ecc71'} />
            <Tag text={card.rarity} color={'#EE5253'} />
            <Tag text={card.set_name} color={'#5F27CD'} />
          </div>
        }
      </div>

      <div className={styles.rightSection}>
        <PriceDetails sales={sales} />
      </div>
    </div>
  )
}
