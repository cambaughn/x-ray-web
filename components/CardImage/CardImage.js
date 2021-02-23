import React, { useState, useEffect } from 'react';
import styles from './CardImage.module.scss';

// Components

// Utility functions

export default function CardImage({}) {
  // Cards that need images defined;
  const [cards, setCards] = useState([]);

  const getCardsNeedingImages = async () => {

  }

  useEffect(getCardsNeedingImages, []);
  
  return (
    <div className={styles.container}>
      { cards.map(card => {
        return (
          <div key={card.id}>

          </div>
        )
      })}
    </div>
  )
}
