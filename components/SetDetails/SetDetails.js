import React, { useState, useEffect } from 'react';
import styles from './SetDetails.module.scss';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// Components

// Utility functions
import pokeSet from '../../util/api/set';


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

  }

  useEffect(getSet, []);
  useEffect(getCards, [currentSet]);

  return (
    <div className={styles.container}>
      <div className={styles.setInfo}>
        <div className={styles.imageWrapper}>
          <img src={currentSet.images.logo} className={styles.logo} />
        </div>
        <h4 className={styles.setName}>{currentSet.name}</h4>
      </div>
    </div>
  )
}
