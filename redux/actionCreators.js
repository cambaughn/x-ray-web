/*eslint no-use-before-define: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint-env es6*/


function setUser(user) {
  return {
    type: 'SET_USER',
    user
  }
}

function setCollectionDetails(collectionDetails) {
  return {
    type: 'SET_COLLECTION_DETAILS',
    collectionDetails
  }
}

function setCollectedItems(collectedItems) {
  return {
    type: 'SET_COLLECTED_ITEMS',
    collectedItems
  }
}

function setCard(card) {
  return {
    type: 'SET_CARD',
    card
  }
}

function setSales(sales) {
  return {
    type: 'SET_SALES',
    sales
  }
}

function setSubscriptionStatus(subscriptionStatus) {
  return {
    type: 'SET_SUBSCRIPTION_STATUS',
    subscriptionStatus
  }
}

function setOnFreeTrial(onFreeTrial) {
  return {
    type: 'SET_ON_FREE_TRIAL',
    onFreeTrial
  }
}

function setIsBetaUser(isBetaUser) {
  return {
    type: 'SET_IS_BETA_USER',
    isBetaUser
  }
}

function setPokemonSeries(pokemonSeries) {
  return {
    type: 'SET_POKEMON_SERIES',
    pokemonSeries
  }
}

function setPokemonSet(pokemonSet) {
  return {
    type: 'SET_POKEMON_SET',
    pokemonSet
  }
}

function setLanguage(language) {
  return {
    type: 'SET_LANGUAGE',
    language
  }
}

function setActionModalStatus(status) {
  return {
    type: 'SET_ACTION_MODAL_STATUS',
    status
  }
}

function setCollectionSortOptions(collectionSortOptions) {
  return {
    type: 'SET_COLLECTION_SORT_OPTIONS',
    collectionSortOptions
  }
}



export {
  setUser,
  setCollectionDetails,
  setCollectedItems,
  setCard,
  setSales,
  setSubscriptionStatus,
  setOnFreeTrial,
  setIsBetaUser,
  setPokemonSeries,
  setPokemonSet,
  setLanguage,
  setActionModalStatus,
  setCollectionSortOptions
};
