import React, { useState, useEffect } from 'react';
import styles from './PSAPopReport.module.scss';

// Components

// Utility functions
import psaPopReport from '../../util/api/psaPopReport.js';


export default function PSAPopReport({ card }) {
  const [reports, setReports] = useState({});

  const getReports = async () => {
    if (card.id) {
      let reportsForCard = await psaPopReport.search('card_id', card.id);
      console.log('got reports ', reportsForCard);

    }
  }

  useEffect(getReports, [card]);

  return (
    <div className={styles.container}>

    </div>
  )
}
