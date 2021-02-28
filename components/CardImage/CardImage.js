import React, { useState, useEffect } from 'react';
import styles from './CardImage.module.scss';

// Components

// Utility functions
import { getCardsWithoutImages } from '../../util/api/admin';
import pokeCard from '../../util/api/card';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';

export default function CardImage({}) {
  // Cards that need images defined;
  const [cards, setCards] = useState([]);
  const [cardImages, setCardImages] = useState({});
  const [noMatch, setNoMatch] = useState({});
  const [gettingCandidates, setGettingCandidates] = useState(false);

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
    if (cards.length > 0 && !gettingCandidates) {
      setGettingCandidates(true);
      let cardInfoRefs = cards.map(card => getCardInfo(card));
      let cardInfo = await Promise.all(cardInfoRefs);
      let cardImageInfo = {};

      console.log('card info ', cardInfo);

      cardInfo.forEach((infoObject, index) => {
        if (infoObject && infoObject.images) {
          cardImageInfo[cards[index].id] = [infoObject.images.small, infoObject.images.large]
        }
      });

      console.log('card image info ', cardImageInfo);

      setCardImages(cardImageInfo);
      setGettingCandidates(false);
    }
  }

  const approveAll = async () => {
    let approvedCards = cards.filter(card => !!cardImages[card.id]);
    approvedCards = approvedCards.map(card => {
      card.thumbnail = cardImages[card.id][0] || null;
      card.hero_image = cardImages[card.id][1] || null;
      return card;
    })

    let cardRefs = approvedCards.map(card => pokeCard.update(card.id, { thumbnail: card.thumbnail, hero_image: card.hero_image }))
    await Promise.all(cardRefs);
    getCardsNeedingImages();
    console.log('updated cards!');

  }

  useEffect(getCardsNeedingImages, []);
  useEffect(getCandidateImages, [cards]);

  return (
    <div className={styles.container}>
      <div className={styles.optionsBar}>
        <div className={styles.approveButton} onClick={approveAll}>
          <span className={styles.approveText}>Approve All</span>
        </div>
      </div>
      { cards.map(card => {
        if (cardImages[card.id]) {
          return (
            <div className={styles.cardRow} key={card.id}>
              <span >{card.name}</span>
              <div className={styles.cardImages}>
                <img src={card.thumbnail} className={styles.image} />
                <img src={cardImages[card.id][1]} className={styles.image} />
                <div className={styles.removeButton}></div>
              </div>

            </div>
          )
        }
      })}
    </div>
  )
}
