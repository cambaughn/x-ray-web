import { dateStringToObject, complexDateStringToObject, releaseStringToObject } from './date.js';

const sortSalesByDate = (sales) => {
  return sales.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else {
      return 1;
    }
  })
}

const sortSetsByDate = (sets) => {
  return sets.sort((a, b) => {
    let a_date = releaseStringToObject(a.releaseDate);
    let b_date = releaseStringToObject(b.releaseDate);
    if (a_date > b_date) {
      return -1;
    } else {
      return 1;
    }
  })
}

const sortCardsByNumber = (cards) => {
  return cards.sort((a, b) => {
    if (parseInt(a.number ) < parseInt(b.number)) {
      return -1;
    } else {
      return 1;
    }
  })
}

const sortCollectionByDate = (items) => {
  return items.sort((a, b) => {
    let a_date = complexDateStringToObject(a.date_added);
    let b_date = complexDateStringToObject(b.date_added);

    if (a_date > b_date) {
      return -1;
    } else {
      return 1;
    }
  })
}

const sortSalesByPrice = (sales, method) => {
  if (method === 'descending') {
    return sales.sort((a, b) => {
      if (a.price > b.price) {
        return -1;
      } else {
        return 1;
      }
    })
  } else {
    return sales.sort((a, b) => {
      if (a.price < b.price) {
        return -1;
      } else {
        return 1;
      }
    })
  }
}

export { sortSalesByDate, sortSalesByPrice, sortCollectionByDate, sortCardsByNumber, sortSetsByDate };
