import React, { useState, useEffect } from 'react';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';

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

      setCard(cardData);
      setSales(salesData);

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
        <img src={card.thumbnail} className={styles.image} />
        <h3 className={styles.cardName}>{card.name}</h3>

        <div className={styles.tags}>
          <Tag text={`${card.number}/${set.num_cards}`} color={'#f1c40f'} />
          <Tag text={card.rarity} color={'#EE5253'} />
          <Tag text={card.set_title} color={'#5F27CD'} />
        </div>
      </div>

      <Pricing sales={sales} />
    </div>
  )
}
