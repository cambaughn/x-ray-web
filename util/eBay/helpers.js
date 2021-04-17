import { hasNonAlphanumeric, replaceCharacters } from '../helpers/string.js';

const createCardSearchNames = (card) => {
  let updatedCard = { ...card }
  updatedCard.search_name = replaceCharacters(card.name);
  updatedCard.search_set_name = replaceCharacters(card.set_name);
  return updatedCard;
}


const checkForUnhandledName = (card) => {
  let unhandledNames = false;


  // Check if either name has non-alphanumeric
  if (hasNonAlphanumeric(card.search_name) || hasNonAlphanumeric(card.search_set_name)) {
    // If it still has some non-alphanumeric characters (aside from a '+'), then go return true
    // console.log(`Not able to search due to unhandled characters: ${card.name} - ${card.set_name}`);
    return true;
  } else { // otherwise, we're good to go
    return false;
  }
}

export { createCardSearchNames, checkForUnhandledName }
