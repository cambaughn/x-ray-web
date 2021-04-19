import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';
import PriceDetails from '../PriceDetails/PriceDetails';

// Utility functions
import pokeCard from '../../util/api/card';
import pokeSet from '../../util/api/set';
import sale from '../../util/api/sales';
import { isPastWeek } from '../../util/helpers/date';
import analytics from '../../util/analytics/segment';

export default function CardDetails({ card_id }) {
  const [card, setCard] = useState({});
  const [sales, setSales] = useState([]);
  const [set, setSet] = useState({});
  const user = useSelector(state => state.user);

  const updateCardSales = async () => {
    try {
      if (card.id) {
        let updateCard = !card.last_updated || !isPastWeek(card.last_updated);

        if (updateCard) {
          const { data } = await axios.post(`${window.location.origin}/api/sales/update_card`, { card: card });

          if (data.updated) {
            getCardDetails();
          }
        }
      }
    } catch(error) {
      console.error(error);
    }
  }

  const getCardDetails = async () => {
    try {
      let cardData = await pokeCard.get(card_id);
      let salesData = await sale.getForCard(card_id);
      let setData = await pokeSet.get(cardData.set_id);

      // console.log('card data ', cardData);
      // console.log('sales data ', salesData);

      setCard(cardData);
      setSales(salesData || []);

      if (!Array.isArray(setData)) {
        setSet(setData);
      }
    } catch(error) {
      console.error(error);
    }
  }

  const recordPageView = () => {
    analytics.page({
      userId: user.id,
      category: 'Card',
      name: 'Card Details',
      properties: {
        url: window.location.href,
        path: `/${card_id}`,
        card_id: card_id,
        title: 'Card Details'
      }
    });
  }

  useEffect(recordPageView, []);
  useEffect(getCardDetails, [card_id]);
  useEffect(updateCardSales, [card]);

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
          <div className={styles.cardData}>
            <span className={styles.label}>Set</span>
            <span className={styles.detail}>{card.set_name}</span>

            <span className={styles.label}>Number</span>
            <span className={styles.detail}>{card.number}/{set.printedTotal}</span>

            <span className={styles.label}>Rarity</span>
            <span className={styles.detail}>{card.rarity}</span>
          </div>
        }
        {/* { card.name &&
          <div className={styles.tags}>
            <Tag text={`${card.number}/${set.printedTotal}`} color={'#2ecc71'} />
            <Tag text={card.rarity} color={'#EE5253'} />
            <Tag text={card.set_name} color={'#5F27CD'} />
          </div>
        } */}
      </div>

      <div className={styles.rightSection}>
        <PriceDetails sales={sales} />
      </div>
    </div>
  )
}
