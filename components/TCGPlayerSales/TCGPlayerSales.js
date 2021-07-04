import React, { useState, useEffect } from 'react';
import styles from './TCGPlayerSales.module.scss';

// Components

// Utility functions
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI.js';
import { capitalize } from '../../util/helpers/string.js';


export default function TCGPlayerSales({ card, prices, setTcgPrices }) {
  const [url, setUrl] = useState(null);
  const priceKeys = [
    { key: 'market', label: 'Market Price'},
    { key: 'low', label: 'Low'},
    { key: 'mid', label: 'Mid'},
    { key: 'high', label: 'High'},
  ]

  const finishMap = {
    '1stEditionHolofoil': '1st Edition Holo',
    'holofoil': 'Holo',
    'reverseHolofoil': 'Reverse Holo',
  }

  const getTCGData = async () => {
    if (card && card.id && card.language === 'en') {
      let cardData = await getCardInfo(card.id);
      let { tcgplayer } = cardData;
      setUrl(tcgplayer.url);
      setTcgPrices(tcgplayer.prices);
    }
  }

  useEffect(getTCGData, [card]);

  return (
    <div className={styles.container}>
      { url && prices &&
        <h3 className={styles.title}>TCGPlayer Prices - Ungraded</h3>
      }

      { Object.keys(prices).map(finish => {
        return (
          <div className={styles.finishWrapper} key={finish}>
            <span className={styles.finishTitle}>{finishMap[finish] || capitalize(finish)}</span>
            {/* <span className={styles.finishTitle}>{finish.toUpperCase()}</span> */}

            <div className={styles.prices}>
              { priceKeys.map(priceKey => {
                return (
                  <div className={styles.priceBlock} key={priceKey.key}>
                    <span className={styles.priceLabel}>{priceKey.label}</span>
                    <span className={styles.price}>${prices[finish][priceKey.key]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
