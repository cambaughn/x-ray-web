import React, { useState, useEffect } from 'react';
import styles from './SalesForCard.module.scss';

// Components

// Utility functions
import sale from '../../util/api/sales.js';

export default function SalesForCard({ card, selectedFinish, selectedGrade, selectedGradingAuthority}) {
  let [sales, setSales] = useState([]);

  const getSales = async () => {
    let salesForCard = await sale.getForGrade(card, selectedGradingAuthority, selectedGrade);
    // TODO: Troubleshoot this function
    console.log('got sales for card ', salesForCard);
  }

  useEffect(getSales, [card, selectedFinish, selectedGrade, selectedGradingAuthority]);

  return (
    <div className={styles.container}>

    </div>
  )
}
