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

const listing = (state = {}, action) => {
  switch (action.type) {
    case 'SET_LISTING':
      return action.listing;
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



const xRayApp = combineReducers({
  user,
  card,
  listing,
  sales
});

export { xRayApp };
