import React, { useState, useEffect } from 'react';
import styles from './SetDetails.module.scss';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { ExternalLink } from 'react-feather';

// Components
import SetCardList from '../SetCardList/SetCardList';
import EditSetDetails from '../EditSetDetails/EditSetDetails';
import FullScreenModal from '../Modal/FullScreenModal';

// Utility functions
import pokeSet from '../../util/api/set';
import pokeCard from '../../util/api/card';
import analytics from '../../util/analytics/segment';
import formattedSale from '../../util/api/formatted_sale.js';
import { sortCardsByNumber } from '../../util/helpers/sorting';
import { lenspath } from '../../util/helpers/object.js';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI.js';


export default function SetDetails({}) {
  const pokemonSets = useSelector(state => state.pokemonSets);
  const user = useSelector(state => state.user);
  const [currentSet, setCurrentSet] = useState({});
  const [tcgPrices, setTcgPrices] = useState({});
  const [cards, setCards] = useState([]);
  const [editModeActive, setEditModeActive] = useState(false);
  const [editModalActive, setEditModalActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [salesForCards, setSalesForCards] = useState({});
  const [psaSearchUrl, setPsaSearchUrl] = useState('');
  const router = useRouter();

  const getSet = async () => {
    let { set_id } = router.query;
    let foundSet;

    for (let i = 0; i < pokemonSets.length; i++) {
      let set = pokemonSets[i];
      if (set.id === set_id) {
        foundSet = set;
        break;
      }
    }

    if (!foundSet) {
      foundSet = await pokeSet.get(set_id);
    }

    setCurrentSet(foundSet);
  }

  const getCards = async () => {
    let { set_id } = router.query;
    let cardsForSet = await pokeCard.search('set_id', set_id);
    cardsForSet = sortCardsByNumber(cardsForSet);
    setCards(cardsForSet);
  }

  const getSales = async () => {
    if (cards.length > 0) {
      let item_ids = cards.map(card => card.id);
      let allSales = await formattedSale.getForMultiple(item_ids);
      let salesLookup = {};

      // Create sales lookup object to easily switch between different specifics
      allSales.forEach(sale => {
        let specifics = sale.id.split('_');
        let [card_id, finish, grading_authority, grade] = specifics;

        salesLookup[card_id] = salesLookup[card_id] || {}; // this is the card
        salesLookup[card_id][finish] = salesLookup[card_id][finish] || {}; // this is the finish
        salesLookup[card_id][finish][grading_authority] = salesLookup[card_id][finish][grading_authority] || {}; // this is the grading_authority
        if (grading_authority === 'ungraded') { // if ungraded, this is the final level, place the sale here
          salesLookup[card_id][finish][grading_authority] = sale;
        } else {
          salesLookup[card_id][finish][grading_authority][grade] = sale;
        }
      })

      // console.log('sales lookup ', salesLookup);

      setSalesForCards(salesLookup);
    }
  }

  const getTCGData = async () => {
    if (cards.length > 0 && currentSet.language === 'english' && Object.keys(tcgPrices).length === 0) {
      let priceDataRefs = cards.map(card => getCardInfo(card.id));
      let priceData = await Promise.all(priceDataRefs);
      let priceLookup = {};
      priceData.forEach(card => {
        if (card && card.id) {
          priceLookup[card.id] = card.tcgplayer ? card.tcgplayer.prices : null;
        }
      })
      setTcgPrices(priceLookup);
    }
  }

  const handleEditButtonClick = () => {
    if (!editModeActive) {
      setEditModeActive(true);
    } else {
      setEditModeActive(false);
      setSelectedItems(new Set());
    }
  }

  const toggleSelectCard = (card_id) => {
    let newSelections = new Set(selectedItems);
    if (newSelections.has(card_id)) {
      newSelections.delete(card_id);
    } else {
      newSelections.add(card_id);
    }

    setSelectedItems(newSelections);
  }

  const makeFullArt = async () => {
    let updates = {
      full_art: true,
      finishes: ['holo']
    }

    let cardsToUpdate = Array.from(selectedItems);
    let updateRefs = cardsToUpdate.map(card_id => pokeCard.update(card_id, updates));
    await Promise.all(updateRefs);
    // console.log('made full art', cardsToUpdate);
    handleEditButtonClick();
  }

  const makeHolo = async () => {
    let updates = {
      full_art: false,
      finishes: ['holo']
    }

    let cardsToUpdate = Array.from(selectedItems);
    let updateRefs = cardsToUpdate.map(card_id => pokeCard.update(card_id, updates));
    await Promise.all(updateRefs);
    // console.log('made holo', cardsToUpdate);
    handleEditButtonClick();
  }


  const selectRight = (event, index) => {
    event.stopPropagation();
    let newSelections = new Set(selectedItems);
    let addToSelection = cards.slice(index).map(card => card.id);
    addToSelection.forEach(card_id => newSelections.add(card_id));

    setSelectedItems(newSelections);
  }

  const toggleEditModal = () => {
    setEditModalActive(!editModalActive);
  }

  const formatPsaSearchUrl = () => {
    if (currentSet.name) {
      // let formattedUrl = `https://www.psacard.com/pop#0%7CPokemon%20${currentSet.name.trim().replace(/ /g, '%20')}`;
      let formattedUrl = `https://www.psacard.com/pop#0%7CPokemon%20${currentSet.series_name.trim().replace(/ /g, '%20')}%20${currentSet.name.trim().replace(/ /g, '%20')}`;
      console.log(formattedUrl);
      setPsaSearchUrl(formattedUrl);
    }
  }

  const recordPageView = () => {
    analytics.page({
      userId: user.id,
      category: 'Set',
      name: 'Set Details',
      properties: {
        url: window.location.href,
        path: `/set/${currentSet.id}`,
        set: currentSet.name
      }
    });
  }

  useEffect(recordPageView, []);
  useEffect(getSet, []);
  useEffect(getCards, []);
  useEffect(getTCGData, [cards]);
  useEffect(getSales, [cards]);
  useEffect(formatPsaSearchUrl, [currentSet]);

  return (
    <div className={styles.container}>
      { currentSet.name &&
        <div className={styles.setInfo}>
          <div className={styles.imageWrapper}>
            <img src={currentSet.images.logo} className={styles.logo} />
          </div>
          <div className={styles.setNameWrapper}>
            <h4 className={styles.setName}>{currentSet.name}</h4>
            { user.role === 'admin' &&
              <a href={psaSearchUrl} target='_blank'>
                <ExternalLink className={styles.externalLink} size={16} />
              </a>
            }
          </div>
        </div>
      }

      { user.role === 'admin' &&
        <div className={styles.editButton} onClick={toggleEditModal}>
          <span>Edit</span>
        </div>
      }

      {/* Uncomment to allow editing of full art / holo cards */}

      {/* { user.role === 'admin' &&
        <div className={styles.buttons}>
          <div className={classNames({ [styles.button]: true, [styles.editModeButton]: true, [styles.saveButton]: editModeActive })} onClick={handleEditButtonClick}>
            <span className={styles.editButtonText}>{ editModeActive ? 'Editing' : 'Edit'}</span>
          </div>

          { editModeActive &&
            <>
              <div className={styles.button} onClick={makeFullArt}>
                <span className={styles.editButtonText}>Make full art</span>
              </div>

              <div className={styles.button} onClick={makeHolo}>
                <span className={styles.editButtonText}>Make holo</span>
              </div>
            </>
          }
        </div>
      } */}



      { cards.length > 0 &&
        <SetCardList cards={cards} editModeActive={editModeActive} toggleSelectCard={toggleSelectCard} selectedItems={selectedItems} salesForCards={salesForCards} tcgPrices={tcgPrices} selectRight={selectRight} />
      }

      { editModalActive &&
        <FullScreenModal toggleModal={toggleEditModal}>
          <EditSetDetails set={currentSet} toggleModal={toggleEditModal} />
        </FullScreenModal>
      }
    </div>
  )
}
