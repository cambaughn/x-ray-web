import {
  formatDateAsString,
  formatDateAsStringWithTime,
  getNowAsStringWithTime,
  getDateInPast,
  getDateInFuture,
  onTrialPeriod,
  releaseStringToObject
} from './date';

describe('Verify date helpers', () => {
  test('Can format a date object as a string', () => {
    let date = new Date(2021, 0, 15);
    expect(formatDateAsString(date)).toBe('2021-0-15');
  });

  test('Can format a date object as a string with time', () => {
    let date = new Date(2021, 0, 15);
    date.setHours(4);
    date.setMinutes(15);
    expect(formatDateAsStringWithTime(date)).toBe('2021-0-15-4-15');
  });

  test('Can format today as a string with time', () => {
    let today = new Date();
    expect(getNowAsStringWithTime()).toBe(formatDateAsStringWithTime(today));
  });

  test('Returns true if the user does have free trial', () => {
    let user = {
      trial_end: formatDateAsStringWithTime(getDateInFuture(7))
    }
    expect(onTrialPeriod(user)).toBe(true);
  });

  test('Returns false if the user does not have free trial', () => {
    let user = {
      trial_end: formatDateAsStringWithTime(getDateInPast(7))
    }
    expect(onTrialPeriod(user)).toBe(false);
  });

  test('Can convert release string to date object', () => {
    let releaseString = '2000/04/24';
    let expectedDate = new Date(2000, 4, 24, 12, 0, 0, 0);
    expect(releaseStringToObject(releaseString)).toStrictEqual(expectedDate);
  });
})
