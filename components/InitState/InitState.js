import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import { setCollectedItems } from '../../redux/actionCreators';
import collectedItem from '../../util/api/collection';

export default function InitState({}) {
  const user = useSelector(state => state.user);
  const collectedItems = useSelector(state => state.collectedItems);
  const dispatch = useDispatch();

  const getCollectedItems = async () => {
    if (user.id && collectedItems.length === 0) {
      let items = await collectedItem.getForUser(user.id);
      dispatch(setCollectedItems(items))
    }
  }

  useEffect(getCollectedItems, [user]);

  return (
    <></>
  )
}
