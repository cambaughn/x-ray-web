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


export {
  setUser,
  setCard,
  setSales,
  setSubscriptionStatus
};
