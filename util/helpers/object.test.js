import { lenspath } from './object';

describe('Return correct value for path', () => {
  let cases = [
    [[{ user_id: 'luke_skywalker'}, 'user_id'], 'luke_skywalker'],
    [[{}, 'user_id'], null],
    [[{}, 'sales.holo.ungraded'], null],
    [[{ sales: { holo: { ungraded: [1, 2, 3] }}}, 'sales.holo.ungraded'], [1, 2, 3]]
  ]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (args, expectedResult) => {
      const result = lenspath(args[0], args[1]);
      expect(result).toEqual(expectedResult);
    }
  );
})
