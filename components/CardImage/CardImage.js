import React, { useState, useEffect } from 'react';
import styles from './CardImage.module.scss';

// Components

// Utility functions
import { getCardsWithoutImages } from '../../util/api/admin';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';

export default function CardImage({}) {
  // Cards that need images defined;
  const [cards, setCards] = useState([]);
  const [cardImages, setCardImages] = useState({});
  const [noMatch, setNoMatch] = useState({});

  const getCardsNeedingImages = async () => {
    try {
      // Just get the cards without hero_image
      let cardsForPage = await getCardsWithoutImages();
      setCards(cardsForPage);
    } catch(error) {
      console.log(error);
    }
  }

  const getCandidateImages = async () => {
    if (cards.length > 0) {
      let cardInfoRefs = cards.map(card => getCardInfo(card));
      let cardInfo = await Promise.all(cardInfoRefs);
      let cardImageInfo = {};

      cardInfo.forEach((infoObject, index) => {
        if (infoObject && infoObject.imageUrl) {
          cardImageInfo[cards[index].id] = [infoObject.imageUrl, infoObject.imageUrlHiRes]
        }
      });

      console.log('card image info ', cardImageInfo);
      setCardImages(cardImageInfo);
    }
  }

  useEffect(getCardsNeedingImages, []);
  useEffect(getCandidateImages, [cards]);

  return (
    <div className={styles.container}>
      { cards.map(card => {
        return (
          <div className={styles.cardRow} key={card.id}>
            <img src={card.thumbnail} className={styles.image} />

            { cardImages[card.id] &&
              <img src={cardImages[card.id][1]} className={styles.image} />
            }

            {/* TODO: Add button/logic for marking noMatch */}
          </div>
        )
      })}
    </div>
  )
}
