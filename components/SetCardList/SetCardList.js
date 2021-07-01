import React, { useState, useEffect } from 'react';
import styles from './SetCardList.module.scss';
import classNames from 'classnames';
import { ArrowRightCircle } from 'react-feather';
import Link from 'next/link';

// Components
import CardImage from '../CardImage/CardImage';

// Utility functions
import { lenspath } from '../../util/helpers/object.js';


export default function SetCardList({ cards, editModeActive, toggleSelectCard, selectedItems, salesForCards }) {
  const renderCard = (card, selected) => {
    let formattedSalesForCard = lenspath(salesForCards, `${card.id}.holo.ungraded.formatted_data`);
    formattedSalesForCard = formattedSalesForCard ? formattedSalesForCard : lenspath(salesForCards, `${card.id}.non-holo.ungraded.formatted_data`)
    let price = formattedSalesForCard ? formattedSalesForCard[formattedSalesForCard.length - 2].averagePrice : null;
    let previousPrice = formattedSalesForCard ? formattedSalesForCard[formattedSalesForCard.length - 3].averagePrice : null;
    let changeStatus = 'flat';

    if (price > previousPrice) {
      changeStatus = 'up';
    } else if (price < previousPrice) {
      changeStatus = 'down';
    }

    return (
      <div className={styles.cardWrapper}>
        <CardImage card={card} selected={selectedItems.has(card.id)} />
        <div className={styles.details}>
          <div className={styles.leftSide}>
            {/* <span className={styles.cardName}>{card.name}{card.full_art ? ' ☆' : ''}</span> */}
            <span className={styles.cardName}>{card.name}</span>
          </div>

          <div className={styles.rightSide}>
            {/* <span className={styles.cardName}>{card.name}{card.full_art ? ' ☆' : ''}</span> */}
            <span className={styles.cardNumber}>#{card.number}</span>
            { formattedSalesForCard && price > 0 &&
              <span className={classNames(styles.price, {[styles.priceUp]: changeStatus === 'up', [styles.priceDown]: changeStatus === 'down', [styles.priceFlat]: changeStatus === 'flat' })}>${price}</span>
            }
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      { cards.map((card, index) => {
        if (editModeActive) {
          return (
            <div className={classNames({ [styles.editCardWrapper]: true })} onClick={() => toggleSelectCard(card.id)} key={card.id}>
              { renderCard(card, selectedItems.has(card.id)) }
              <div className={styles.selectRightButton} onClick={(event) => selectRight(event, index)}>
                <ArrowRightCircle className={styles.arrowRight} />
              </div>
            </div>
          )
        } else {
          return (
            <Link href={`/card/${card.id}`} key={`${card.id}`}>
              { renderCard(card) }
            </Link>
          )
        }
      })}
    </div>
  )
}
