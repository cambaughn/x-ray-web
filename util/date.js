const months = {
  Jan: 0,
  Feb: 1,
  March: 2,
  Apr: 3,
  May: 4,
  June: 5,
  July: 6,
  Aug: 7,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11
}

// Turn a date string into a date object
const dateStringToObject = (dateString) => {
  let dates = dateString.replace(',').split(' ');
  let month = months[dates[0]];
  let day = parseInt(dates[1]);
  let year = parseInt(dates[2]);

  let date = new Date(year, month, day, 12, 0, 0, 0);
  return date;
}

const isLastMonth = (date) => {
  let monthAgo = new Date();
  // Set it to one month ago
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  return date >= monthAgo;
}

// dateStringToObject('Jan 07, 2021');

export { dateStringToObject, isLastMonth }
