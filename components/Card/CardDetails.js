import React, { useState, useEffect } from 'react';
import styles from './CardDetails.module.scss';

// Components

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
      console.log('got card => ', cardData);
      console.log('got set => ', setData);
      console.log('got sales => ', salesData);
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
      <img src={card.thumbnail} className={styles.image} />
      <h3 className={styles.cardName}>{card.name}</h3>
      <span className={styles.cardNumber}>{card.number}/{set.num_cards}</span>
      <span className={styles.setTitle}>{set.title}</span>
      <span className={styles.setTitle}>{set.title}</span>
    </div>
  )
}
