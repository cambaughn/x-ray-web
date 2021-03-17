import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';
import PriceDetails from '../PriceDetails/PriceDetails';

// Utility functions
import pokeCard from '../../util/api/card';
import pokeSet from '../../util/api/set';
import sale from '../../util/api/sales';
import analytics from '../../util/analytics/segment';

export default function CardDetails({ card_id }) {
  const [card, setCard] = useState({});
  const [sales, setSales] = useState([]);
  const [set, setSet] = useState({});
  const user = useSelector(state => state.user);

  const getCardDetails = async () => {
    try {
      let cardData = await pokeCard.get(card_id);
      let salesData = await sale.getForCard(card_id);
      let setData = await pokeSet.get(cardData.set_id);

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
