import React, { useState, useEffect } from 'react';
import styles from './EditSetDetails.module.scss';
import classNames from 'classnames';

// Components

// Utility functions
import pokeSet from '../../util/api/set';


export default function EditSetDetails({ set, toggleModal, setCurrentSet }) {
  const [psaPopUrls, setPsaPopUrls] = useState([]);
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  const setUpForm = () => {
    let urls = [ ...set.psa_pop_urls, '' ];
    setPsaPopUrls(urls);
  }

  const updatePsaPopUrls = (value, index) => {
    let urls = [ ...psaPopUrls ];
    urls[index] = value;

    if (urls[urls.length - 1] !== '') {
      urls.push('');
    }

    setPsaPopUrls(urls);
  }

  const determineSaveActive = () => {
    let active = false;
    psaPopUrls.forEach((url, index) => {
      if (url !== set.psa_pop_urls[index] && index !== psaPopUrls.length - 1) { // the url has changed from what's in the database
        active = true;
      }
    })
    setSaveButtonActive(active);
  }

  const handleSave = async () => {
    if (saveButtonActive) {
      let updates = {
        psa_pop_urls: psaPopUrls.filter(url => !!url)
      }

      await pokeSet.update(set.id, updates);
      console.log('updated ', set.name, updates);
      let updatedSet = await pokeSet.get(set.id);
      setCurrentSet(updatedSet);
      toggleModal();
    }
  }

  useEffect(setUpForm, [set]);
  useEffect(determineSaveActive, [psaPopUrls]);

  return (
    <div className={styles.container}>
      <h3>Edit details for {set.name}</h3>

      <span className={styles.label}>PSA Pop URL</span>
      { psaPopUrls.map((url, index) => {
        return (
          <input
            type="text"
            value={psaPopUrls[index]}
            onChange={event => updatePsaPopUrls(event.target.value.trim(), index)}
            className={styles.textInput}
            key={index}
          />
        )
      })}


      <div className={classNames(styles.saveButton, { [styles.saveButtonActive]: saveButtonActive })} onClick={handleSave}>
        <span>Save</span>
      </div>
    </div>
  )
}
