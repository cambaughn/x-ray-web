import React, { useState, useEffect } from 'react';
import styles from './Browse.module.scss';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

// Components

// Utility functions
import pokeSeries from '../../util/api/series';
import pokeSet from '../../util/api/set';
import { sortSetsByDate } from '../../util/helpers/sorting';
import { setPokemonSet, setPokemonSeries } from '../../redux/actionCreators';


export default function Browse({}) {
  const pokemonSeries = useSelector(state => state.pokemonSeries);
  const pokemonSets = useSelector(state => state.pokemonSets);
  const [seriesLookup, setSeriesLookup] = useState({});
  const [setLookup, setSetLookup] = useState({});
  const [language, setLanguage] = useState('japanese');
  const dispatch = useDispatch();

  const englishSeries = ['Sword & Shield', 'Sun & Moon', 'XY', 'Black & White', 'Black & White Promos', 'Call of Legends', 'HeartGold SoulSilver', 'Platinum', 'Nintendo Promos', 'Diamond & Pearl', 'EX Ruby & Sapphire', 'e-Card', 'Legendary Collection', 'Neo Genesis', 'Gym Heroes', 'Base Set' ];
  const japaneseSeries = ['Sword & Shield', 'Sun & Moon', 'Pokemon XY', 'Black & White Promos', 'Black & White', 'Legend', 'DPt', 'PPP Promos', 'DP Era', 'Pokemon VS', 'Neo', 'Original'];


  const getSeriesInfo = async () => {
    let updatedSeriesLookup = seriesLookup;
    if (Object.keys(seriesLookup).length === 0) {
      let seriesInfo = await pokeSeries.get();

      seriesInfo.forEach(series => {
        updatedSeriesLookup[series.id] = series;
      })

      setSeriesLookup(updatedSeriesLookup);
    }

    const sortingOrder = language === 'english' ? englishSeries : japaneseSeries;

    let sortedSeries = language === 'english' ? sortingOrder : sortingOrder.map(series => series + ' JPN');
    sortedSeries = sortedSeries.map(name => updatedSeriesLookup[name] || {})

    dispatch(setPokemonSeries(sortedSeries));
  }

  const getSetInfo = async () => {
    let setInfo = await pokeSet.get();
    setInfo = sortSetsByDate(setInfo);
    dispatch(setPokemonSet(setInfo));
  }

  const createSetLookup = () => {
    let lookup = {};
    pokemonSets.forEach(set => {
      lookup[set.series_id] = lookup[set.series_id] || [];
      lookup[set.series_id].push(set);
    })

    setSetLookup(lookup);
  }


  useEffect(getSeriesInfo, [language]);
  useEffect(getSetInfo, []);
  useEffect(createSetLookup, [pokemonSets]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Browse by Set</h2>

      <div className={styles.languageButtons}>
        <div className={classNames({ [styles.languageButton]: true, [styles.selectedLanguage]: language === 'english' })} onClick={() => setLanguage('english')}>
          <span className={styles.languageButtonText}>English</span>
        </div>
        <div className={classNames({ [styles.languageButton]: true, [styles.selectedLanguage]: language === 'japanese' })} onClick={() => setLanguage('japanese')}>
          <span className={styles.languageButtonText}>Japanese</span>
        </div>
      </div>

      { pokemonSeries.map(series => {
        return (
          <div className={styles.seriesWrapper} key={series.id}>
            <div className={styles.seriesInfo}>
              <div className={styles.seriesLogoWrapper}>
                <img src={series && series.logo ? series.logo : null} className={styles.seriesLogo} />
              </div>
              <h3 className={styles.seriesName}>{series.name}</h3>
            </div>

            { setLookup[series.id] &&
              <div className={styles.setsInSeries}>
                { setLookup[series.id].map(set => {
                  return (
                    <Link href={`/set/${set.id}`} key={set.id}>
                      <div className={styles.setCard}>
                        <div className={styles.setLogoWrapper}>
                          <img src={set.images.logo} className={styles.setLogo} />
                        </div>
                        <span className={styles.setName}>{set.name}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            }
          </div>
        )
      })}

    </div>
  )
}
