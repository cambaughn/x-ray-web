const characterMap = {
  '&': 'and',
  '-': '+',
  '—': '+',
  'α': 'alpha',
  'β': 'beta',
  'δ': 'delta',
  'γ': 'gamma',
  '◇': 'prism star',
  '♂': '',
  '♀': '',
  '\\(': '',
  '\\)': '',
  '\\[': '',
  '\\]': '',
  '\\:': '',
  '\\!': '',
  '\\?': '',
  '\\,': '',
  '\\.': ' ',
  "_____'s Pikachu": 'Happy Birthday Pikachu',
  "ナッシー": ''
}

const replaceCharacters = (string) => {
  let newString = string;
  Object.keys(characterMap).forEach(key => {
    let regex = new RegExp(key, "g");
    newString = newString.replace(regex, characterMap[key]);
  })

  newString = newString.trim();

  let spaceRegex = new RegExp(' ', "g");
  newString = newString.replace(/\s\s+/g, ' ').replace(/\s/g, '+').replace(/\++/g, '+');

  return newString;
}

const hasNonAlphanumeric = (string) => {
  let regex = /[^a-zA-Z0-9áéíóú#\+\']/g;
  let matches = string.match(regex);

  return matches && matches.length > 0 ? true : false;
}

export { replaceCharacters, hasNonAlphanumeric }
