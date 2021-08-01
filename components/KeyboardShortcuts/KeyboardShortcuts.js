import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components

// Utility functions
import { setActionModalStatus } from '../../redux/actionCreators';


export default function KeyboardShortcuts({ children, sort, addSingleCard }) {
  const shortcutsActive = useSelector(state => state.shortcutsActive);
  const dispatch = useDispatch();

  let shortcuts = {
    83: 'sort',
    65: 'addSingleCard'
  }

  const handleKeyDown = (event) => {
    if (!!shortcutsActive) {
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
  }

  const setEventListeners = () => {
    if (shortcutsActive) {
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      }
    } else if (!shortcutsActive) {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }

  useEffect(setEventListeners, [shortcutsActive])
  // useEffect(toggleListeners, [shortcutsActive])


  return <>
    { children }
  </>
}
