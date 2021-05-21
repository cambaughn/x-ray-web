import React, { useState, useEffect } from 'react';
import styles from './SetDetails.module.scss';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import classNames from 'classnames';

// Components

// Utility functions
import pokeSet from '../../util/api/set';
import pokeCard from '../../util/api/card';
import { sortCardsByNumber } from '../../util/helpers/sorting';


export default function SetDetails({}) {
  const pokemonSets = useSelector(state => state.pokemonSets);
  const [currentSet, setCurrentSet] = useState({});
  const [cards, setCards] = useState([]);
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

      { cards.length > 0 &&
        <div className={styles.cardList}>
          { cards.map(card => {
            return (
              <Link href={`/card/${card.id}`} key={`${card.id}`}>
              <div className={styles.cardWrapper}>
                <img src={card.images.small} className={styles.thumbnail} />
                <div className={styles.details}>
                  <span className={styles.cardName}>{card.name}</span>
                  <span className={styles.cardNumber}>#{card.number}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      }
    </div>
  )
}
