import { formatDateAsString, formatDateAsStringWithTime } from './date';

describe.only('Verify date helpers', () => {
  test('Can format a date object as a string', () => {
    let date = new Date(2021, 0, 15);
    expect(formatDateAsString(date)).toBe('2021-0-15');
  });

})
