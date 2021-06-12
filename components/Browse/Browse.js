import React, { useState, useEffect } from 'react';
import styles from './Browse.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components
import SetInfoCard from '../SetInfoCard/SetInfoCard';

// Utility functions
import pokeSeries from '../../util/api/series';
import pokeSet from '../../util/api/set';
import { sortSetsByDate } from '../../util/helpers/sorting';
import { setPokemonSet, setPokemonSeries } from '../../redux/actionCreators';


export default function Browse({}) {
  const pokemonSeries = useSelector(state => state.pokemonSeries);
  const pokemonSets = useSelector(state => state.pokemonSets);
  const [setLookup, setSetLookup] = useState({});
  const dispatch = useDispatch();
  const sortingOrder = ['Sword & Shield', 'Sun & Moon', 'XY', 'Black & White', 'Black & White Promos', 'Call of Legends', 'HeartGold SoulSilver', 'Platinum', 'Nintendo Promos', 'Diamond & Pearl', 'EX Ruby & Sapphire', 'e-Card', 'Legendary Collection', 'Neo Genesis', 'Gym Heroes', 'Base Set' ];

  const getSeriesInfo = async () => {
    let seriesInfo = await pokeSeries.getEnglish();
    let seriesLookup = {};

    seriesInfo.forEach(series => {
      seriesLookup[series.id] = series;
    })

    let sortedSeries = sortingOrder.map(name => seriesLookup[name] || {});
    dispatch(setPokemonSeries(sortedSeries));
  }

  const getSetInfo = async () => {
    let setInfo = await pokeSet.getEnglish();
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

  useEffect(getSeriesInfo, []);
  useEffect(getSetInfo, []);
  useEffect(createSetLookup, [pokemonSets]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Browse by Set</h2>

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
                    <SetInfoCard set={set} key={set.id} />
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
