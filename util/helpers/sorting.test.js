import { sortCardsByNumber } from './sorting';

describe('Verify sorting functions', () => {
  test('Test sortCardsByNumber() with only numbers', () => {
    let cards = [
      { number: '5' },
      { number: '1' },
      { number: '3' },
      { number: '2' },
      { number: '4' },
      { number: '6' },
    ]

    let sorted = sortCardsByNumber(cards).map(card => card.number);
    let expected = [ '1', '2', '3', '4', '5', '6' ];
    expect(sorted).toStrictEqual(expected);
  });

  test('Test sortCardsByNumber() with numbers and letters', () => {
    let cards = [
      { number: 'H1' },
      { number: '1' },
      { number: 'H3' },
      { number: '3' },
      { number: 'H2' },
      { number: '2' },
    ]

    let sorted = sortCardsByNumber(cards).map(card => card.number);
    let expected = [ '1', '2', '3', 'H1', 'H2', 'H3' ];
    expect(sorted).toStrictEqual(expected);
  });

  test('Test sortCardsByNumber() for Generations', () => {
    let cards = [
      { number: 'RC1' },
      { number: 'RC3' },
      { number: '3' },
      { number: 'RC2' },
      { number: '2' },
      { number: '1' },
    ]

    let sorted = sortCardsByNumber(cards).map(card => card.number);
    let expected = [ '1', '2', '3', 'RC1', 'RC2', 'RC3' ];
    expect(sorted).toStrictEqual(expected);
  });
})
