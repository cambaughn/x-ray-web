import React, { useState, useEffect } from 'react';
import styles from './TCGPlayerSales.module.scss';

// Components

// Utility functions
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI.js';
import { lenspath } from '../../util/helpers/object.js';
import { capitalize } from '../../util/helpers/string.js';


export default function TCGPlayerSales({ card }) {
  const [url, setUrl] = useState(null);
  const [prices, setPrices] = useState({});
  const priceKeys = [
    { key: 'market', label: 'Market Price'},
    { key: 'low', label: 'Low'},
    { key: 'mid', label: 'Mid'},
    { key: 'high', label: 'High'},
  ]

  const getTCGData = async () => {
    if (card && card.id && card.language === 'en') {
      let cardData = await getCardInfo(card.id);
      let { tcgplayer } = cardData;
      setUrl(tcgplayer.url);
      setPrices(tcgplayer.prices);
      console.log('getting tcg ', tcgplayer);
    }
  }

  useEffect(getTCGData, [card]);

  return (
    <div className={styles.container}>
      { url && prices &&
        <>
          <h3>TCGPlayer Prices</h3>
          { Object.keys(prices).map(finish => {
            return (
              <div className={styles.finishWrapper} key={finish}>
                <span className={styles.finishTitle}>{capitalize(finish)}</span>

                { priceKeys.map(priceKey => {
                  return (
                    <div className={styles.prices} key={priceKey.key}>
                      <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>{priceKey.label}</span>
                        <span className={styles.price}>{prices[finish][priceKey.key]}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </>
      }
    </div>
  )
}
