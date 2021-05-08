import { sortSalesByType, determineFinish } from './sales';

// describe('Sorts sales based on grade and finish', () => {
//   test('Sorts array of card objects with view_count', () => {
//     let searchResults = [
//       { name: 'M Charizard-EX', set_name: 'Evolutions' },
//       { name: 'Charizard & Reshiram', set_name: 'Unbroken Bonds', view_count: 10 },
//       { name: 'Charizard', set_name: 'base', view_count: 100 }
//     ]
//
//     let sorted = sortSearchResults(searchResults).map(result => result.name);
//     let expected = [ 'Charizard', 'Charizard & Reshiram', 'M Charizard-EX' ];
//     expect(sorted).toEqual(expected);
//   });
// })


describe('Determine finish based on title', () => {
  test('Defaults to non-holo', () => {
    let title = 'Charizard #43 Darkness Ablaze - Near Mint!'
    expect(determineFinish(title)).toEqual('non-holo');
  });

  test('Handles reverse holo', () => {
    let title = "Pikachu 77/101 Reverse Holo - PSA 10? Champion's Path - Pack fresh!"
    expect(determineFinish(title)).toEqual('reverse_holo');
  });

  test('Handles holo in title', () => {
    let title = "Gyarados 101/150 Holo - PSA 10? Vivid Voltage!"
    expect(determineFinish(title)).toEqual('holo');
  });

  test('Handles holographic in title', () => {
    let title = "Gyarados 101/150 Holographic - PSA 10? Vivid Voltage!"
    expect(determineFinish(title)).toEqual('holo');
  });

  test('Handles foil in title', () => {
    let title = "Gyarados 101/150 Foil - PSA 10? Vivid Voltage!"
    expect(determineFinish(title)).toEqual('holo');
  });
})
