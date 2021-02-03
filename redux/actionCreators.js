/*eslint no-use-before-define: "off"*/
/*eslint no-unused-vars: "off"*/
/*eslint-env es6*/


function setUser(user) {
  return {
    type: 'SET_USER',
    user
  }
}

function setCard(card) {
  return {
    type: 'SET_CARD',
    card
  }
}

function setListing(listing) {
  return {
    type: 'SET_LISTING',
    listing
  }
}

function setSales(sales) {
  return {
    type: 'SET_SALES',
    sales
  }
}


export {
  setUser,
  setCard,
  setListing,
  setSales
};
