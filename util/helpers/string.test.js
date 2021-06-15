import { replaceCharacters, hasNonAlphanumeric, isSpecialCard, isBaseOrBase2, numberWithCommas, shortenSetName, isExCard } from './string';

describe('Verify alphanumeric checker', () => {
  test('Returns false for blank string', () => {
    expect(hasNonAlphanumeric('')).toBe(false);
  });

  test('Returns false for alphanumeric string', () => {
    expect(hasNonAlphanumeric('abc123')).toBe(false);
  });

  test('Returns false for alphanumeric string with +', () => {
    expect(hasNonAlphanumeric('abc+123')).toBe(false);
  });

  test('Returns false for alphanumeric string with apostrophe', () => {
    expect(hasNonAlphanumeric("Misty's+Cerulean+City+Gym")).toBe(false);
  });

  test('Returns true for string of spaces', () => {
    expect(hasNonAlphanumeric('     ')).toBe(true);
  });

  test('Returns true for alphanumeric string with spaces', () => {
    expect(hasNonAlphanumeric('This is simply a test 123')).toBe(true);
  });

  test('Returns true for string with periods', () => {
    expect(hasNonAlphanumeric('This is simply a test 123')).toBe(true);
  });

  test('Returns true for string with question marks', () => {
    expect(hasNonAlphanumeric('Is this a test?')).toBe(true);
  });

  test('Returns true for string with exclamation points', () => {
    expect(hasNonAlphanumeric('This is a test!')).toBe(true);
  });

  test('Returns true for string with Greek', () => {
    expect(hasNonAlphanumeric('This is a test β')).toBe(true);
  });
})


describe('Replaces characters', () => {
  test('Replaces empty spaces with +', () => {
    expect(replaceCharacters('abc 123')).toBe('abc+123');
  });

  test('Replaces & with and', () => {
    expect(replaceCharacters('han&leia')).toBe('hanandleia');
  });

  test('Handle delta', () => {
    expect(replaceCharacters('Blastoise δ')).toBe('Blastoise+delta');
  });

  test('Handle delta for Mewtwo', () => {
    expect(replaceCharacters('Mewtwo δ')).toBe('Mewtwo+delta');
  });

  test('Handle period', () => {
    expect(replaceCharacters('Meowth lv.x')).toBe('Meowth+lv+x');
  });

  test('Handle multiple spaces', () => {
    expect(replaceCharacters('     ')).toBe('');
  });

  test('Handle multiple spaces', () => {
    expect(replaceCharacters('pikachu ◇')).toBe('pikachu+prism+star');
  });

  test('Handle question marks', () => {
    expect(replaceCharacters('pikachu ?')).toBe('pikachu');
  });

  test('Handle semicolon', () => {
    expect(replaceCharacters('Normalium Z: Tackle')).toBe('Normalium+Z+Tackle');
  });

  test('Handle parentheses', () => {
    expect(replaceCharacters("Professor's Research (Professor Magnolia)")).toBe("Professor's+Research+Professor+Magnolia");
  });

  test('Handle square brackets', () => {
    expect(replaceCharacters("Unown [A]")).toBe("Unown+A");
  });

  test('Handle Happy Birthday Pikachu', () => {
    expect(replaceCharacters("_____'s Pikachu")).toBe("Happy+Birthday+Pikachu");
  });

  test('Handle Exeggutor', () => {
    expect(replaceCharacters("ナッシー[Exeggutor]")).toBe("Exeggutor");
  });

  test("Handle Blaine's Quiz #1 - Gym Heroes", () => {
    expect(replaceCharacters("Blaine's Quiz #1 - Gym Heroes")).toBe("Blaine's+Quiz+#1+Gym+Heroes");
  });

  test("Handle Blastoise Prism Star", () => {
    expect(replaceCharacters("Blastoise ◇")).toBe("Blastoise+prism+star");
  });

  test("Is special name", () => {
    expect(replaceCharacters("Blastoise ◇")).toBe("Blastoise+prism+star");
  });
})

describe('Find cards with special names', () => {
  let cases = [['M Charizard-GX', true], ['Charizard-EX', true], ['Pikachu VMAX', true], ['Pikachu EX', true], ['Charizard GX', true], ['Pikachu V', true], ['Starmie BREAK', true], ['Extra Credit', false], ['Squirtle', false]]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (name, expectedResult) => {
      const result = isSpecialCard(name);
      expect(result).toEqual(expectedResult);
    }
  );
})

describe('Find EX cards', () => {
  let cases = [['M Charizard-GX', false], ['Charizard-EX', true], ['Pikachu VMAX', false], ['Pikachu EX', true], ['Charizard GX', false]]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (name, expectedResult) => {
      const result = isExCard(name);
      expect(result).toEqual(expectedResult);
    }
  );
})

describe('Find base set cards', () => {
  let cases = [['Base', true], ['Base Set 2', true], ['Expedition Base Set', false], ['Sun & Moon Base', false]]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (set_name, expectedResult) => {
      const result = isBaseOrBase2(set_name);
      expect(result).toEqual(expectedResult);
    }
  );
})

describe('Handle number formatting with commas', () => {
  let cases = [[1000, '1,000'], [20000.12, '20,000.12'], [1234567.89, '1,234,567.89'], [35, '35']]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (number, expectedResult) => {
      const result = numberWithCommas(number);
      expect(result).toEqual(expectedResult);
    }
  );
})

describe('Handle shortening set name', () => {
  let cases = [['Strengthening Expansion: Shining Legends', 'Shining Legends'], ['Shining Fates', 'Shining Fates'], ['Pokemon XY: Evolutions', 'Evolutions']]

  test.each(cases)(
    "given %o as an argument, returns %p",
    (setName, expectedResult) => {
      const result = shortenSetName(setName);
      expect(result).toEqual(expectedResult);
    }
  );
})
