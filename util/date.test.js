import { formatDateAsString, formatDateAsStringWithTime } from './date';

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
})
