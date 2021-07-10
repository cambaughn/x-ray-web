import React, { useState, useEffect } from 'react';
import styles from './Table.module.scss';

// Components

// Utility functions
import { capitalize } from '../../util/helpers/string.js';


export default function Table({ headers = [], data = [] }) {
  return (
    <table className={styles.container}>
      { headers.length > 0 &&
        <tr className={styles.row}>
          { headers.map(header => {
            return (
              <th className={styles.header} key={header}>{capitalize(header)}</th>
            )
          })}
        </tr>
      }

      { data.length > 0 &&
        <>
          { data.map((row, index) => {
            return (
              <tr className={styles.row} key={index}>
                { row.map(item => {
                  return (
                    <td className={styles.data}>{item}</td>
                  )
                })}
              </tr>
            )
          })}
        </>
      }
    </table>
  )
}
