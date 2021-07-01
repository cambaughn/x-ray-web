import React, { useState, useEffect } from 'react';
import styles from './CardInfo.module.scss';

// Components
import AddToCollectionButton from '../Buttons/AddToCollectionButton';

// Utility functions

export default function CardInfo({ card, set, setEditingName, editingName, cardName, setCardName, toggleCardAddition, showHelpText }) {
  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.imageWrapper}>
          { card.images && (card.images.small || card.images.large) &&
            <img src={card.images.small || card.images.large} className={styles.image} />
          }
        </div>

        { editingName ? (
          <input type='text' className={styles.cardName} value={cardName} onChange={(event) => setCardName(event.target.value)} onKeyDown={handleEnterKey} />
        ): (
          <h3 className={styles.cardName} onDoubleClick={() => user.role === 'admin' && setEditingName(true)}>{cardName}</h3>
        )}

        <div className={styles.addButtonWrapper}>
          <AddToCollectionButton handleClick={toggleCardAddition} showHelpText={showHelpText} />
        </div>

        { card.name &&
          <>
            <div className={styles.cardData}>
              <span className={styles.label}>Set</span>
              <span className={styles.detail}>{card.set_name}</span>

              <span className={styles.label}>Number</span>
              <span className={styles.detail}>{card.number}/{set.printedTotal}</span>

              <span className={styles.label}>Rarity</span>
              <span className={styles.detail}>{card.rarity}</span>
            </div>

          </>
        }
      </div>
    </div>
  )
}
