import React from 'react';
import styles from './Main.module.scss';

// Components
import Tag from '../Tag/Tag';
import Pricing from '../Pricing/Pricing';

// Utility functions

export default function Main({ card,  sales, user }) {
  return (
    <div className={styles.container}>
      { card.image_url &&
        <img src={card.image_url} alt={'card front'} className={styles.cardImage} />
      }
      <h2 className={styles.cardName}>{card.name}</h2>
      { card.rarity && card.set_title &&
        <div className={styles.tags}>
          <Tag text={card.rarity} color={'#EE5253'} />
          <Tag text={card.set_title} color={'#5F27CD'} />
        </div>
      }

      <Pricing sales={sales} />
    </div>
  )
}
