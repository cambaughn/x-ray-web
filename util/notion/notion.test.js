import { textToNumber } from './notion';

describe('Verify notion functions', () => {
  test('Removes characters properly', () => {
    expect(textToNumber('SV49')).toEqual(49);
  });  
  
  test('Converts number properly', () => {
    expect(textToNumber('50')).toEqual(50);
  });

  test('Handles empty string', () => {
    expect(textToNumber('')).toEqual(null);
  });

})
