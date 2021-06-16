import React, { useState, useEffect } from 'react';
import styles from './CardImageUpdate.module.scss';
import classNames from 'classnames';
import { XOctagon } from 'react-feather';

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
  const [newImages, setNewImages] = useState({});
  const [rejectedImages, setRejectedImages] = useState(new Set());

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
    } else {
      setCards([]);
    }
  }

  const getImages = async () => {
    if (selectedSet.id) {
      let images = await card_images.getForSet(selectedSet.name);
      // images = sortCardsByNumber(images);
      let imageLookup = {};
      images.forEach(image => {
        imageLookup[image.number] = image;
      })
      // console.log('images ', images);
      setNewImages(imageLookup);
    } else {
      setNewImages({});
    }
  }

  const toggleRejectImage = (card_id) => {
    let newRejectedItems = new Set(rejectedImages);
    if (newRejectedItems.has(card_id)) {
      newRejectedItems.delete(card_id);
    } else {
      newRejectedItems.add(card_id);
    }

    setRejectedImages(newRejectedItems);
  }

  const handleSave = async () => {
    let imageUpdates = cards.map(card => {
      let updates = {};
      let image_url = newImages[card.number] && newImages[card.number].url ? newImages[card.number].url : null;

      if (!rejectedImages.has(card.id) && image_url) { // if it's not rejected
      // Switch current images to alternate_images
        updates.alternate_images = card.images || null;
        updates.images = {
          small: null,
          large: image_url
        }
      } else  { // no image available
        updates.alternate_images = null;
      }

      if (rejectedImages.has(card.id)) {
        console.log('rejected ', card.name, card.number);
      }

      return pokeCard.update(card.id, updates);
    })

    await Promise.all(imageUpdates);
    console.log('updated all images');
    // Add images_updated = true to set
    await pokeSet.update(selectedSet.id, { images_updated: true });
    console.log('updated set');

    // console.log(imageUpdates);
    // Set new image to images.large
    getSets();
    setSelectedSet({});
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
        { selectedSet.id &&
          <div onClick={handleSave} className={styles.saveButton}>
            <span>Save Images</span>
          </div>
        }

        { cards.map(card => {
          let image = newImages[card.number] || null;

          return (
            <div className={styles.cardRow} key={card.id}>
              <div className={styles.cardWrapper}>
                <CardImage card={card} />
                <span>{card.number} - {card.name}</span>
              </div>

              { image &&
                <>
                  <div className={styles.cardWrapper}>
                    <img src={image.url} className={styles.newCardImage} />
                    <span>{image.number} - {image.name}</span>
                  </div>
                  <div onClick={() => toggleRejectImage(card.id)}>
                    <XOctagon className={classNames(styles.rejectButton, { [styles.rejected]: rejectedImages.has(card.id) })} />
                  </div>
                </>
              }

            </div>
          )
        })}
      </div>

      {/* <div className={styles.cards}>
        { newImages.map(image => {
          return (
            <div key={image.url} className={styles.cardWrapper}>
              <img src={image.url} className={styles.newCardImage} />
              <span>{image.number} - {image.name}</span>
            </div>
          )
        })}
      </div> */}

    </div>
  )
}
