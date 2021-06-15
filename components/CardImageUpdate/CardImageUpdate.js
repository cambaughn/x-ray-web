import React, { useState, useEffect } from 'react';
import styles from './CardImageUpdate.module.scss';
import classNames from 'classnames';

// Components
import AdminNav from '../AdminNav/AdminNav';
import CardImage from '../CardImage/CardImage';

// Utility functions
import pokeSet from '../../util/api/set';
import pokeCard from '../../util/api/card';
import card_images from '../../util/api/storage';
import { sortCardsByNumber } from '../../util/helpers/sorting';


export default function CardImageUpdate({}) {
  const [setsToUpdate, setSetsToUpdate] = useState([]);
  const [selectedSet, setSelectedSet] = useState({});
  const [cards, setCards] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const getSets = async () => {
    let sets = await pokeSet.getLanguage('japanese');
    sets = sets.filter(set => !set.images_updated);
    console.log(sets);
    setSetsToUpdate(sets);
  }

  const getCardsForSet = async () => {
    if (selectedSet.id) {
      let cardsForSet = await pokeCard.search('set_id', selectedSet.id);
      cardsForSet = sortCardsByNumber(cardsForSet);
      setCards(cardsForSet);
    }
  }

  const getImages = async () => {
    if (selectedSet.id) {
      let images = await card_images.getForSet(selectedSet.name);
      images = sortCardsByNumber(images);
      // console.log('images ', images);
      setNewImages(images);
    }
  }

  useEffect(getSets, []);
  useEffect(getCardsForSet, [selectedSet]);
  useEffect(getImages, [selectedSet]);


  return (
    <div className={styles.container}>
      <AdminNav />

      <div>
        { setsToUpdate.map(set => {
          return (
            <div className={classNames(styles.setButton, { [styles.selectedSet]: selectedSet.id === set.id })} onClick={() => setSelectedSet(set)} key={set.id}>
              <span>{set.name}</span>
            </div>
          )
        })}

      </div>

      <div className={styles.cards}>
        { cards.map(card => {
          return (
            <div key={card.id} className={styles.cardWrapper}>
              <CardImage card={card} />
              <span>{card.number} - {card.name}</span>
            </div>
          )
        })}
      </div>

      <div className={styles.cards}>
        { newImages.map(image => {
          return (
            <div key={image.url} className={styles.cardWrapper}>
              <img src={image.url} className={styles.newCardImage} />
              <span>{image.number} - {image.name}</span>
            </div>
          )
        })}
      </div>

    </div>
  )
}
