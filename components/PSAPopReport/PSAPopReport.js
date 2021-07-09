import React, { useState, useEffect } from 'react';
import styles from './PSAPopReport.module.scss';

// Components

// Utility functions
import psaPopReport from '../../util/api/psaPopReport.js';
import { capitalize } from '../../util/helpers/string.js';


export default function PSAPopReport({ card }) {
  const [reports, setReports] = useState({});

  const grades = ['total', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const finishes = ['holo', 'reverse_holo', 'non-holo'];
  const finishMap = { holo: 'Holo', reverse_holo: 'Reverse Holo', 'non-holo': 'Non-Holo' }

  const getReports = async () => {
    if (card.id) {
      let reportsForCard = await psaPopReport.search('card_id', card.id);
      let reportsLookup = {};
      reportsForCard.forEach(report => {
        reportsLookup[report.finish] = report;
      })
      console.log('got reports ', reportsLookup);
      setReports(reportsLookup);
    }
  }

  useEffect(getReports, [card]);

  return (
    <div className={styles.container}>
      { Object.keys(reports).length > 0 &&
        <h3 className={styles.title}>PSA Population Report</h3>
      }

      { finishes.filter(finish => !!reports[finish]).map(finish => {
        let total = reports[finish].population.total;

        return (
          <div className={styles.finishWrapper} key={finish}>
            <span className={styles.finishTitle}>{finishMap[finish] || capitalize(finish)}</span>

            <div className={styles.grades}>
              {/* Keys */}
              <div className={styles.gradeBlock}>
                <span className={styles.gradeLabel}>Grade</span>
                <span className={styles.number}>#</span>
                <span className={styles.percentage}>%</span>
              </div>

              { grades.map((grade, index) => {
                let numberForGrade = reports[finish].population[grade];
                let percentage = ((numberForGrade / total) * 100).toFixed(1);
                return (
                  <div className={styles.gradeBlock} key={index}>
                    <span className={styles.gradeLabel}>{grade === 'total' ? 'Total' : grade}</span>
                    <span className={styles.number}>{numberForGrade}</span>
                    <span className={styles.percentage}>{percentage}</span>
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
