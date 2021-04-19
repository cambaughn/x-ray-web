import { dateStringToObject } from './helpers/date.js';

const sortSalesByDate = (sales) => {
  return sales.sort((a, b) => {
    if (a.date > b.date) {
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

export { sortSalesByDate, sortSalesByPrice };
