import { checkForUnhandledName, createCardSearchNames } from './helpers.js';

describe('Test unhandled names', () => {
  let unhandledCards = [
    { name: 'Blastoise _', set_name: 'Vivid Voltage' },
    { name: 'Eevee <', set_name: 'Battle Styles' }
  ].map(card => [card, true])

  let handledCards = [
    { name: 'Blastoise ◇', set_name: 'Vivid Voltage' },
    { name: 'Pikachu', set_name: 'Darkness—Ablaze' },
    { name: 'Eevee !', set_name: 'Battle Styles' }
  ].map(card => [card, false])

  let cases = [...unhandledCards, ...handledCards]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (card, expectedResult) => {
      card = createCardSearchNames(card);
      const result = checkForUnhandledName(card);
      expect(result).toEqual(expectedResult);
    }
  );

  // test('Returns true if cards contain unhandled characters', () => {
  //   expect(checkForUnhandledNames(unhandledCards)).toBe(true);
  // });
  //
  // test('Returns false if cards do not contain unhandled characters', () => {
  //   expect(checkForUnhandledNames(handledCards)).toBe(false);
  // });
})
