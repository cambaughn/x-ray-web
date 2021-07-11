import React, { useState, useEffect } from 'react';
import styles from './EditSetDetails.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import pokeSet from '../../util/api/set';


export default function EditSetDetails({ set }) {
  const [psaPopUrl, setPsaPopUrl] = useState('');
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  const setUpForm = () => {
    setPsaPopUrl(set.psa_pop_url);
  }

  const determineSaveActive = () => {
    if (psaPopUrl && psaPopUrl !== set.psa_pop_url) {
      setSaveButtonActive(true);
    } else {
      setSaveButtonActive(false);
    }
  }

  const handleSave = async () => {
    if (saveButtonActive) {
      let updates = {
        psa_pop_url: psaPopUrl
      }

      await pokeSet.update(set.id, updates);
      console.log('updated ', set.name);
    }
  }

  useEffect(setUpForm, [set]);
  useEffect(determineSaveActive, [psaPopUrl]);

  return (
    <div className={styles.container}>
      <h3>Edit details for {set.name}</h3>

      <span className={styles.label}>PSA Pop URL</span>
      <input
        type="text"
        value={psaPopUrl}
        onChange={event => setPsaPopUrl(event.target.value.trim())}
        className={styles.textInput}
        autoFocus
      />

      <div className={classNames(styles.saveButton, { [styles.saveButtonActive]: saveButtonActive })} onClick={handleSave}>
        <span>Save</span>
      </div>
    </div>
  )
}
