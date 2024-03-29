import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import { setCollectedItems, setCollectionDetails, setLanguage, setCollectionSortOptions } from '../../redux/actionCreators';
import collectedItem from '../../util/api/collection';
import pokeCard from '../../util/api/card';
import { localStorageKeys } from '../../util/localStorage';

export default function InitState({}) {
  const user = useSelector(state => state.user);
  const collectedItems = useSelector(state => state.collectedItems);
  const collectionDetails = useSelector(state => state.collectionDetails);
  const dispatch = useDispatch();

  const getCollectedItems = async () => {
    if (user.id && collectionDetails.length === 0) {
      let item_details = await collectedItem.getForUser(user.id);
      dispatch(setCollectionDetails(item_details));

      let itemsToGet = item_details.map(detail => detail.item_id);
      let items = await pokeCard.getMultiple(itemsToGet);
      let itemLookup = {};
      items.forEach(item => {
        itemLookup[item.id] = item;
      })
      dispatch(setCollectedItems(itemLookup));
    }
  }

  const getLanguage = () => {
    let languageSetting = window.localStorage.getItem(localStorageKeys.language) || 'english';
    dispatch(setLanguage(languageSetting));
  }

  const getSortOptions = () => {
    let sortOptions = window.localStorage.getItem(localStorageKeys.collectionSortOptions) || null;

    if (sortOptions) {
      sortOptions = JSON.parse(sortOptions);
      dispatch(setCollectionSortOptions(sortOptions));
    }
  }

  useEffect(getCollectedItems, [user]);
  useEffect(getLanguage, []);
  useEffect(getSortOptions, []);

  return (
    <></>
  )
}
