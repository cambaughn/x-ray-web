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
  let result = matches && matches.length > 0 ? true : false;
  return result;
}

const isSpecialCard = (name) => {
  name = name.toLowerCase();
  let terms = ['-gx', '-ex', 'vmax', ' ex', ' gx', ' v'];

  for (let i = 0; i < terms.length; i++) {
    let term = terms[i];
    if (name.toLowerCase().slice(name.length - term.length) === term) {
      return true;
    }
  }

  return false;
}

const isBaseOrBase2 = (set_name) => {
  set_name = set_name.toLowerCase().trim();

  return set_name === 'base' || set_name === 'base set 2';
}

const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { replaceCharacters, hasNonAlphanumeric, isSpecialCard, isBaseOrBase2, numberWithCommas }
