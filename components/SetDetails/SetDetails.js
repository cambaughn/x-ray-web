import React, { useState, useEffect } from 'react';
import styles from './SetDetails.module.scss';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';
import { ArrowRightCircle } from 'react-feather';

// Components

// Utility functions
import pokeSet from '../../util/api/set';
import pokeCard from '../../util/api/card';
import { sortCardsByNumber } from '../../util/helpers/sorting';


export default function SetDetails({}) {
  const pokemonSets = useSelector(state => state.pokemonSets);
  const user = useSelector(state => state.user);
  const [currentSet, setCurrentSet] = useState({});
  const [cards, setCards] = useState([]);
  const [editModeActive, setEditModeActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
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
    console.log('made full art', cardsToUpdate);
    handleEditButtonClick();
  }


  const selectRight = (event, index) => {
    event.stopPropagation();
    let newSelections = new Set(selectedItems);
    let addToSelection = cards.slice(index).map(card => card.id);
    addToSelection.forEach(card_id => newSelections.add(card_id));

    setSelectedItems(newSelections);
    console.log('selecting right', addToSelection);
  }

  const renderCard = (card, selected) => {
    return (
      <div className={styles.cardWrapper}>
        <img src={card.images.small} className={classNames({[styles.thumbnail]: true, [styles.selectedCard]: selected })} />
        <div className={styles.details}>
          <span className={styles.cardName}>{card.name}{card.full_art ? ' ☆' : ''}</span>
          <span className={styles.cardNumber}>#{card.number}</span>
        </div>
      </div>
    )
  }

  useEffect(getSet, []);
  useEffect(getCards, []);

  return (
    <div className={styles.container}>
      { currentSet.name &&
        <div className={styles.setInfo}>
          <div className={styles.imageWrapper}>
            <img src={currentSet.images.logo} className={styles.logo} />
          </div>
          <h4 className={styles.setName}>{currentSet.name}</h4>
        </div>
      }

      { user.role === 'admin' &&
        <div className={styles.buttons}>
          <div className={classNames({ [styles.button]: true, [styles.editModeButton]: true, [styles.saveButton]: editModeActive })} onClick={handleEditButtonClick}>
            <span className={styles.editButtonText}>{ editModeActive ? 'Editing' : 'Edit'}</span>
          </div>

          { editModeActive &&
            <div className={styles.button} onClick={makeFullArt}>
              <span className={styles.editButtonText}>Make full art</span>
            </div>
          }
        </div>
      }



      { cards.length > 0 &&
        <div className={styles.cardList}>
          { cards.map((card, index) => {
            if (editModeActive) {
              return (
                <div className={classNames({ [styles.editCardWrapper]: true })} onClick={() => toggleSelectCard(card.id)} key={card.id}>
                  { renderCard(card, selectedItems.has(card.id)) }
                  <div className={styles.selectRightButton} onClick={(event) => selectRight(event, index)}>
                    <ArrowRightCircle className={styles.arrowRight} />
                  </div>
                </div>
              )
            } else {
              return (
                <Link href={`/card/${card.id}`} key={`${card.id}`}>
                  { renderCard(card) }
                </Link>
              )
            }
          })}
        </div>
      }
    </div>
  )
}
