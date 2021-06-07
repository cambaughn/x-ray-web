import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';
import PriceDetails from '../PriceDetails/PriceDetails';
import LoadingSpinner from '../Icons/LoadingSpinner';
import AddToCollectionButton from '../Buttons/AddToCollectionButton';
import AddCardModal from '../AddCardModal/AddCardModal';

// Utility functions
import pokeCard from '../../util/api/card';
import pokeSet from '../../util/api/set';
import sale from '../../util/api/sales';
import { isPastWeek } from '../../util/helpers/date';
import analytics from '../../util/analytics/segment';

export default function CardDetails({ card_id }) {
  const [card, setCard] = useState({});
  const [sales, setSales] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [set, setSet] = useState({});
  const [updatingSales, setUpdatingSales] = useState(false);
  const [updatedViewCount, setUpdatedViewCount] = useState(false);
  const [addCardModalVisible, setAddCardModalVisible] = useState(false);
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails);
  const isBetaUser = useSelector(state => state.isBetaUser);


  const updateViewCount = async () => {
    if (card.id && !updatedViewCount) {
      let view_count = card.view_count || 0;
      view_count++;

      await pokeCard.update(card.id, { view_count });
      setUpdatedViewCount(true);
    }
  }

  const updateCardSales = async () => {
    try {
      if (card.id) {
        let updateCard = !card.last_updated || !isPastWeek(card.last_updated);

        if (updateCard) {
          setUpdatingSales(true);
          const { data } = await axios.post(`${window.location.origin}/api/sales/update_card`, { card: card });

          if (data.updated) {
            console.log('updated!');
            getCardDetails();
          }
        }
      }
    } catch(error) {
      console.error(error);
    }

    setUpdatingSales(false);
  }

  const getCardDetails = async () => {
    try {
      // await pokeCard.update(card_id, { last_updated: null });
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

  const toggleCardAddition = () => {
    setAddCardModalVisible(!addCardModalVisible)
  }

  useEffect(recordPageView, []);
  useEffect(getCardDetails, [card_id]);
  // useEffect(updateCardSales, [card]);
  useEffect(updateViewCount, [card]);

  return (
    <div className={styles.container}>
      <div className={styles.leftRail}>
        <div className={styles.imageWrapper}>
          { card.images && card.images.small &&
            <img src={card.images.small} className={styles.image} />
          }
        </div>

        <h3 className={styles.cardName}>{card.name}</h3>

        { isBetaUser &&
          <div className={styles.addButtonWrapper}>
            <AddToCollectionButton handleClick={toggleCardAddition} showHelpText={collectionDetails.length <= 1} />
          </div>
        }

        { card.name &&
          <>
            <div className={styles.cardData}>
              <span className={styles.label}>Set</span>
              <span className={styles.detail}>{card.set_name}</span>

              <span className={styles.label}>Number</span>
              <span className={styles.detail}>{card.number}/{set.printedTotal}</span>

              <span className={styles.label}>Rarity</span>
              <span className={styles.detail}>{card.rarity}</span>
            </div>

          </>
        }

        { !!updatingSales &&
          <div className={styles.loaderWrapper}>
            <LoadingSpinner color={'grey'} />
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
        <PriceDetails card={card} finishes={finishes} setFinishes={setFinishes} />
      </div>

      { addCardModalVisible &&
        <AddCardModal card={card} toggleModal={toggleCardAddition} finishes={finishes} />
      }
    </div>
  )
}
