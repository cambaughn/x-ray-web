import { combineReducers } from 'redux';


const user = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user;
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



const xRayApp = combineReducers({
  user,
  card,
  sales,
  subscriptionStatus
});

export { xRayApp };
