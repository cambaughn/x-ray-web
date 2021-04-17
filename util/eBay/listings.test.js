import { checkForUnhandledNames } from './listings.js';

describe('Test unhandled names', () => {
  let unhandledCards = [
    { name: 'Blastoise ◇', set_name: 'Vivid Voltage' },
    { name: 'Pikachu', set_name: 'Darkness—Ablaze' },
    { name: 'Eevee <', set_name: 'Battle Styles' }
  ]

  let handledCards = [
    { name: 'Blastoise ◇', set_name: 'Vivid Voltage' },
    { name: 'Pikachu', set_name: 'Darkness—Ablaze' },
    { name: 'Eevee !', set_name: 'Battle Styles' }
  ]

  test('Returns true if cards contain unhandled characters', () => {
    expect(checkForUnhandledNames(unhandledCards)).toBe(true);
  });

  test('Returns false if cards do not contain unhandled characters', () => {
    expect(checkForUnhandledNames(handledCards)).toBe(false);
  });

})
