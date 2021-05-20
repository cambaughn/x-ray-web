import React, { useState, useEffect } from 'react';
import styles from './Browse.module.scss';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import pokeSeries from '../../util/api/series';
import pokeSet from '../../util/api/set';
import { setPokemonSet, setPokemonSeries } from '../../redux/actionCreators';


export default function Browse({}) {
  const pokemonSeries = useSelector(state => state.pokemonSeries);
  const pokemonSet = useSelector(state => state.pokemonSet);
  const dispatch = useDispatch();

  const getSeriesInfo = async () => {
    let seriesInfo = await pokeSeries.get();
    dispatch(setPokemonSeries(seriesInfo));
  }

  const getSetInfo = async () => {
    let setInfo = await pokeSet.get();
    dispatch(setPokemonSet(setInfo));
  }

  useEffect(getSeriesInfo, []);
  useEffect(getSetInfo, []);

  return (
    <div className={styles.container}>

    </div>
  )
}
