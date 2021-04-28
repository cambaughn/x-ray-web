import { convertToUSD } from './currency';

describe('Convert currency', () => {
  test('Converts AUD correctly', () => {
    expect(convertToUSD('AUD', 250)).toBe(192.5);
  });

  test('Converts GBP correctly', () => {
    expect(convertToUSD('GBP', 1000)).toBe(1390);
  });

  test('Converts EUR correctly', () => {
    expect(convertToUSD('EUR', 10)).toBe(12);
  });

  test('Converts CAD correctly', () => {
    expect(convertToUSD('CAD', 100)).toBe(79);
  });
})
