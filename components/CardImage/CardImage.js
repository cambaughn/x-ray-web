import React, { useState, useEffect } from 'react';
import styles from './CardImage.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import pokeCard from '../../util/api/card';
import { getCardInfo } from '../../util/pokemonAPI/pokemonAPI';

export default function CardImage({ card, selected }) {
  return (
    <div className={styles.container}>
      <img src={card.images.small} className={classNames({[styles.thumbnail]: true, [styles.selectedCard]: selected })} />
    </div>
  )
}
