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
  Dec: 11,
  0: 'Jan',
  1: 'Feb',
  2: 'March',
  3: 'Apr',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug',
  8: 'Sept',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
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

const dateSoldToObject = (dateString) => {
  if (dateString) {
    let pieces = dateString.split(' ').map(piece => {
      return piece.replace(' ', '').replace(',', '')
    })

    let month = months[pieces[0]];
    let day = parseInt(pieces[1]);
    let year = parseInt(pieces[2]);
    let date = new Date(year, month, day, 12, 0, 0, 0);

    return date;
  } else {
    return null;
  }
}

// Comparison functions

const isLastMonth = (date) => {
  let monthAgo = new Date();
  // Set it to one month ago
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  return date >= monthAgo;
}

const isLastThreeMonths = (date) => {
  let threeMonthsAgo = new Date();
  // Set it to one month ago
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return date >= threeMonthsAgo;
}

const datesAreSameDay = (first, second) => {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}


const formatDateLabelForChart = (date) => {
  return `${months[date.getMonth()]} ${date.getDate()}`
}

const formatWeekLabel = (start, end) => {
  let startMonth = months[start.getMonth()];
  let endMonth = months[end.getMonth()];
  
  return `${startMonth} ${start.getDate()}-${startMonth !== endMonth ? endMonth + ' ' : ''}${end.getDate()}`
}

const getDatesForMonth = (numDays) => {
  let dates = [];
  let i = 0;

  while (dates.length < 31) {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i);

    dates.unshift(targetDate);
    i++;
  }

  return dates;
}

const getDates = (numDays = 30) => {
  let dates = [];
  let i = 0;

  while (dates.length <= numDays) {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - i);

    dates.unshift(targetDate);
    i++;
  }

  return dates;
}

const getWeeks = (numWeeks = 12) => {
  let weeks = [];
  let i = 0;

  while (weeks.length <= numWeeks) {
    let weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7));

    weeks.unshift(weekStart);
    i++;
  }

  return weeks;
}


const formatDateObjects = (dates) => {
  return dates.map(date => {
    return `${date.getMonth()}`
  })
}


export { dateStringToObject, isLastMonth, isLastThreeMonths, getDates, getWeeks, datesAreSameDay, formatDateLabelForChart, formatWeekLabel, dateSoldToObject }
