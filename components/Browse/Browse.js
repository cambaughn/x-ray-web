import React, { useState, useEffect } from 'react';
import styles from './Browse.module.scss';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

// Components

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
  const sortingOrder = ['Sword & Shield', 'Sun & Moon', 'XY', 'Black & White', 'Black & White Promos', 'Call of Legends', 'HeartGold SoulSilver', 'Platinum', 'Nintendo Promos', 'Diamond & Pearl', 'EX Ruby & Sapphire', 'E-Card', 'Legendary Collection', 'Neo Genesis', 'Gym Heroes', 'Base' ];

  const getSeriesInfo = async () => {
    let seriesInfo = await pokeSeries.get();
    let seriesLookup = {};

    seriesInfo.forEach(series => {
      seriesLookup[series.name] = series;
    })

    let sortedSeries = sortingOrder.map(name => seriesLookup[name]);
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
      lookup[set.series] = lookup[set.series] || [];
      lookup[set.series].push(set);
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
                <img src={series.logo} className={styles.seriesLogo} />
              </div>
              <h3>{series.name}</h3>
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
