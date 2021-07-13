import React, { useState, useEffect } from 'react';
import styles from './PSAPopReport.module.scss';

// Components
import Table from '../Table/Table';

// Utility functions
import psaPopReport from '../../util/api/psaPopReport.js';
import { capitalize } from '../../util/helpers/string.js';


export default function PSAPopReport({ card }) {
  const [reports, setReports] = useState({});

  const grades = ['total', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const variants = ['first_edition', 'shadowless', 'unlimited'];
  const variantMap = { first_edition: 'First Edition', shadowless: 'Shadowless', unlimited: '' }
  const finishes = ['holo', 'reverse_holo', 'non-holo'];
  const finishMap = { holo: 'Holo', reverse_holo: 'Reverse Holo', 'non-holo': 'Non-Holo' }

  const getReports = async () => {
    if (card.id) {
      let reportsForCard = await psaPopReport.search('card_id', card.id);
      let reportsLookup = {};
      reportsForCard.forEach(report => {
        reportsLookup[report.variant] = reportsLookup[report.variant] || {};
        reportsLookup[report.variant][report.finish] = report;
      })

      setReports(reportsLookup);
    }
  }

  const determineTableData = (variant = 'unlimited', finish) => {
    let total = reports[variant][finish].population.total;

    let rows = grades.map((grade, index) => {
      let numForGrade = reports[variant][finish].population[grade];
      let percentage = ((numForGrade / total) * 100).toFixed(1) + '%';
      return [ grade, numForGrade, percentage];
    })

    return rows;
  }

  useEffect(getReports, [card]);

  return (
    <div className={styles.container}>
      { Object.keys(reports).length > 0 &&
        <h3 className={styles.title}>PSA Population Report</h3>
      }

      { variants.filter(variant => reports[variant] && Object.keys(reports[variant]).length > 0).map(variant => {
        return (
          <>
            { finishes.filter(finish => !!reports[variant][finish]).map(finish => {
              let title = `${finishMap[finish] || capitalize(finish)}`;
              title = variantMap[variant] ? title + ` - ${variantMap[variant]}` : title;

              return (
                <div className={styles.finishWrapper} key={finish}>
                  <span className={styles.finishTitle}>{title}</span>

                  <Table data={determineTableData(variant, finish)} detailed={true} />
                </div>
              )
            })}
          </>
        )
      })}
    </div>
  )
}
