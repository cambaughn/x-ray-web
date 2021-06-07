const months = {
  Jan: 0,
  Feb: 1,
  March: 2,
  Mar: 2,
  Apr: 3,
  May: 4,
  June: 5,
  Jun: 5,
  July: 6,
  Jul: 6,
  Aug: 7,
  Sept: 8,
  Sep: 8,
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

// Turns a date object into the stringified format YYYY-MM-DD for input into streak_dates
const formatDateAsString = (date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Turns a date object into the stringified format YYYY-MM-DD-H-M
const formatDateAsStringWithTime = (date) => {
  let dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`
  return dateString;
}


// Returns today's date as a string in the format YYYY-MM-DD
const getNowAsString = () => {
  let today = new Date();
  today = formatDateAsString(today);
  return today;
}

// Returns today's date as a string in the format YYYY-MM-DD-H-M
const getNowAsStringWithTime = () => {
  let today = new Date();
  return formatDateAsStringWithTime(today);
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

// Turn a date string (with hours and minutes) into a date object
const complexDateStringToObject = (dateString) => {
  let dates = dateString.split('-').map(number => +number);
  let date = new Date(dates[0], dates[1], dates[2], dates[3], dates[4], 0, 0);
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

const releaseStringToObject = (releaseString) => {
  let pieces = releaseString.split('/');

  let year = parseInt(pieces[0]);
  let month = parseInt(pieces[1]);
  let day = parseInt(pieces[2]);
  let date = new Date(year, month, day, 12, 0, 0, 0);

  return date;
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

const isPastWeek = (dateString) => {
  let dateToCheck = complexDateStringToObject(dateString);
  let dateInPast = getDateInPast(7);

  return dateToCheck >= dateInPast;
}

// Get a date some number of days in the future
const getDateInFuture = (daysInFuture) => {
  let date = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * daysInFuture);
  return date;
}

// Get a date some number of days in the past
const getDateInPast = (daysInPast) => {
  let date = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * -daysInPast);
  return date;
}


// Determine if the user is on their trial period
const onTrialPeriod = (user) => {
  let now = new Date();
  if (user.trial_end && complexDateStringToObject(user.trial_end) > now) { // if the user has not yet passed their free trial end date
    return true;
  } else {
    return false;
  }
}

// console.log('date in future ', formatDateAsStringWithTime(getDateInFuture(14)));


export {
  formatDateAsString,
  formatDateAsStringWithTime,
  getNowAsString,
  getNowAsStringWithTime,
  dateStringToObject,
  complexDateStringToObject,
  isLastMonth,
  isLastThreeMonths,
  getDates,
  getWeeks,
  getDateInPast,
  getDateInFuture,
  datesAreSameDay,
  formatDateLabelForChart,
  formatWeekLabel,
  dateSoldToObject,
  isPastWeek,
  onTrialPeriod,
  releaseStringToObject,
  months
}
