import React, { useState, useEffect } from 'react';
import styles from './Table.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import { capitalize } from '../../util/helpers/string.js';


export default function Table({ data = [], detailed }) {
  return (
    <table className={styles.container}>
      { data.length > 0 &&
        <>
          { data.map((row, i) => {
            return (
              <tr className={classNames(styles.row, { [styles.detailed]: detailed })} key={i}>
                { row.map((item, j) => {
                  if (j === 0) {
                    return (
                      <th className={styles.header} key={item}>{capitalize(item)}</th>
                    )
                  } else {
                    return (
                      <td className={styles.data} key={item}>{item}</td>
                    )
                  }
                })}
              </tr>
            )
          })}
        </>
      }
    </table>
  )
}
