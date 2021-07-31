import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './CardDetails.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';
import PriceDetails from '../PriceDetails/PriceDetails';
import LoadingSpinner from '../Icons/LoadingSpinner';
import CardInfo from '../CardInfo/CardInfo';
import KeyboardShortcuts from '../KeyboardShortcuts/KeyboardShortcuts';

// Utility functions
import pokeCard from '../../util/api/card';
import pokeSet from '../../util/api/set';
import sale from '../../util/api/sales';
import { isPastWeek } from '../../util/helpers/date';
import analytics from '../../util/analytics/segment';
import { setFocusedCard } from '../../redux/actionCreators';

export default function CardDetails({ card_id }) {
  const [card, setCard] = useState({});
  const [sales, setSales] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [set, setSet] = useState({});
  const [updatingSales, setUpdatingSales] = useState(false);
  const [updatedViewCount, setUpdatedViewCount] = useState(false);
  // Editing states
  const [editingName, setEditingName] = useState(false);
  const [cardName, setCardName] = useState('');
  // Redux
  const user = useSelector(state => state.user);
  const collectionDetails = useSelector(state => state.collectionDetails);
  const isBetaUser = useSelector(state => state.isBetaUser);
  const dispatch = useDispatch();


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

      dispatch(setFocusedCard(cardData));
      setCard(cardData);
      setCardName(cardData.name);
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

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      saveName();
    }
  }

  const saveName = async () => {
    await pokeCard.update(card.id, { name: cardName });
    let cardData = await pokeCard.get(card_id);
    setCard(cardData);
    setCardName(cardData.name);
    setEditingName(false);
  }

  useEffect(recordPageView, []);
  useEffect(getCardDetails, [card_id]);
  // useEffect(updateCardSales, [card]);
  useEffect(updateViewCount, [card]);

  return (
    <KeyboardShortcuts addSingleCard>
      <div className={styles.container}>
        <CardInfo card={card} editingName={editingName} setEditingName={setEditingName} cardName={cardName} setCardName={setCardName} showHelpText={collectionDetails.length <= 1} set={set} />

        <div className={styles.rightSection}>
          <PriceDetails card={card} finishes={finishes} setFinishes={setFinishes} />

          {/* { viewMode === 'sales' &&
            <SalesForCard card={card} finishes={finishes} setFinishes={setFinishes} setViewMode={setViewMode} />
          } */}
        </div>
      </div>
    </KeyboardShortcuts>
  )
}
