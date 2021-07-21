import React, { useState, useEffect } from 'react';
import styles from './PSAPopReport.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useSelector } from 'react-redux';

// Components
import Table from '../Table/Table';

// Utility functions
import psaPopReport from '../../util/api/psaPopReport.js';
import { capitalize } from '../../util/helpers/string.js';
import { complexDateStringToObject } from '../../util/helpers/date.js';


export default function PSAPopReport({ card }) {
  const [reports, setReports] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [availableFinishes, setAvailableFinishes] = useState([]);
  const user = useSelector(state => state.user);

  const grades = ['total', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const variants = ['first_edition', 'shadowless', 'unlimited'];
  const variantMap = { first_edition: 'First Edition', shadowless: 'Shadowless', unlimited: '' }
  const finishes = ['holo', 'reverse_holo', 'non-holo'];
  const finishMap = { holo: 'Holo', reverse_holo: 'Reverse Holo', 'non-holo': 'Non-Holo' }

  const getReports = async () => {
    if (card.id) {
      let reportsForCard = await psaPopReport.search('card_id', card.id);
      let reportsLookup = {};
      let dateUpdated = null;

      reportsForCard.forEach(report => {
        reportsLookup[report.variant] = reportsLookup[report.variant] || {};
        reportsLookup[report.variant][report.finish] = report;

        if (!dateUpdated) {
          dateUpdated = report.last_updated;
        }
      })

      if (dateUpdated) {
        dateUpdated = complexDateStringToObject(dateUpdated);
        dateUpdated = dayjs(dateUpdated).fromNow();
      } else {
        dateUpdated = null;
      }

      setLastUpdated(dateUpdated);
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

      { lastUpdated && user.role === 'admin' &&
        <span className={styles.lastUpdated}>updated {lastUpdated}</span>
      }

      { variants.filter(variant => reports[variant] && Object.keys(reports[variant]).length > 0).map(variant => {
        let showTitle = Object.keys(reports).length > 1 || Object.keys(reports[variant]).length > 1;

        return (
          <div key={variant}>
            { finishes.filter(finish => !!reports[variant][finish]).map((finish, index) => {
              let title = `${finishMap[finish] || capitalize(finish)}`;
              title = variantMap[variant] ? title + ` - ${variantMap[variant]}` : title;

              return (
                <div className={styles.finishWrapper} key={`${finish}_${variant}_${index}`}>
                  { showTitle &&
                    <span className={styles.finishTitle}>{title}</span>
                  }
                  <Table data={determineTableData(variant, finish)} detailed={true} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
