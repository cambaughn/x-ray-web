import { combineReducers } from 'redux';


const user = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
    default:
      return state;
  }
}

const collectionDetails = (state = [], action) => {
  switch (action.type) {
    case 'SET_COLLECTION_DETAILS':
      return action.collectionDetails;
    default:
      return state;
  }
}

const collectedItems = (state = {}, action) => {
  switch (action.type) {
    case 'SET_COLLECTED_ITEMS':
      return action.collectedItems;
    default:
      return state;
  }
}

const card = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CARD':
      return action.card;
    default:
      return state;
  }
}

const sales = (state = [], action) => {
  switch (action.type) {
    case 'SET_SALES':
      return action.sales;
    default:
      return state;
  }
}

const subscriptionStatus = (state = '', action) => {
  switch (action.type) {
    case 'SET_SUBSCRIPTION_STATUS':
      return action.subscriptionStatus;
    default:
      return state;
  }
}

const onFreeTrial = (state = false, action) => {
  switch (action.type) {
    case 'SET_ON_FREE_TRIAL':
      return action.onFreeTrial;
    default:
      return state;
  }
}

const isBetaUser = (state = false, action) => {
  switch (action.type) {
    case 'SET_IS_BETA_USER':
      return action.isBetaUser;
    default:
      return state;
  }
}


// Store all series and sets for browsing
const pokemonSeries = (state = [], action) => {
  switch (action.type) {
      case 'SET_POKEMON_SERIES':
      return action.pokemonSeries;
    default:
      return state;
  }
}

const pokemonSets = (state = [], action) => {
  switch (action.type) {
    case 'SET_POKEMON_SET':
      return action.pokemonSet;
    default:
      return state;
  }
}



const xRayApp = combineReducers({
  user,
  collectedItems,
  collectionDetails,
  card,
  sales,
  subscriptionStatus,
  onFreeTrial,
  isBetaUser,
  pokemonSeries,
  pokemonSets
});

export { xRayApp };
