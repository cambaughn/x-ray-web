import { flatten, sortSearchResults } from './array';

describe('Verify array functions', () => {
  test('Flattens array', () => {
    let arrayOfArrays = [[1, 2, 3], [4, 5, 6]]
    expect(flatten(arrayOfArrays)).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test('Sorts array of card objects without view_count', () => {
    let searchResults = [
      { name: 'M Charizard-EX', set_name: 'Evolutions' },
      { name: 'Charizard & Reshiram', set_name: 'Unbroken Bonds' },
      { name: 'Charizard', set_name: 'base' }
    ]

    let sorted = sortSearchResults(searchResults).map(result => result.name);
    let expected = [ 'Charizard', 'M Charizard-EX', 'Charizard & Reshiram' ];
    expect(sorted).toStrictEqual(expected);
  });

  test('Sorts array of card objects with view_count', () => {
    let searchResults = [
      { name: 'M Charizard-EX', set_name: 'Evolutions' },
      { name: 'Charizard & Reshiram', set_name: 'Unbroken Bonds', view_count: 10 },
      { name: 'Charizard', set_name: 'base', view_count: 100 }
    ]

    let sorted = sortSearchResults(searchResults).map(result => result.name);
    let expected = [ 'Charizard', 'Charizard & Reshiram', 'M Charizard-EX' ];
    expect(sorted).toEqual(expected);
  });

})
