import { dateStringToObject } from './date.js';

const sortSalesByDate = (sales) => {
  return sales.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else {
      return 1;
    }
  })
}

export { sortSalesByDate };
