import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';


export default function KeyboardShortcuts({ children, sort, addSingleCard }) {
  const dispatch = useDispatch();

  let shortcuts = {
    83: 'sort',
    65: 'addSingleCard'
  }

  const handleKeyDown = (event) => {
    // console.log(event.keyCode);
    switch (shortcuts[event.keyCode]) {
      case 'sort':
        // Toggle the ActionModal in sorting mode
        // Only if "sort" shortcut is enabled for this page
        sort && dispatch(setActionModalStatus('sort'));
        break;
      case 'addSingleCard':
        // Toggle the ActionModal in addSingleCard mode
        // Only if "addSingleCard" shortcut is enabled for this page
        addSingleCard && dispatch(setActionModalStatus('addSingleCard'));
        break;
      }
  }

  const handleKeyUp = (event) => {

  }

  const setEventListeners = () => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }

  useEffect(setEventListeners, [])


  return <>
    { children }
  </>
}
