import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import pokeSet from './set';
import { isSpecialCard, isExCard } from '../helpers/string';

// Series > Set > Card
const pokeCard = {};

pokeCard.create = async (id, newCard) => {
  try {
    return db.collection('pokemon_cards').doc(id).set(newCard);
  } catch(error) {
    console.error(error);
  }
}

pokeCard.update = async (id, updates) => {
  try {
    return db.collection('pokemon_cards').doc(id).update(updates);
  } catch(error) {
    console.error(error);
  }
}

pokeCard.get = async (id) => {
  try {
    if (id) { // get specific card
      return db.collection('pokemon_cards').doc(id).get()
      .then(function(doc) {
        return convertDoc(doc);
      })
    } else { // get all cards
      return db.collection('pokemon_cards').get()
      .then(function(snapshot) {
        let sets = convertSnapshot(snapshot);
        return sets;
      })
    }
  } catch(error) {
    console.error(error);
  }
}

pokeCard.getLanguage = async (language = 'english') =>  {
  try {
    return db.collection('pokemon_cards').where('language', '==', language).get()
    .then(function(snapshot) {
      let cards = convertSnapshot(snapshot);
      return cards;
    })
  } catch(error) {
    console.error(error);
  }
}

pokeCard.getMultiple = async (ids) => {
  try {
    let cardRefs = ids.map(id => db.collection('pokemon_cards').doc(id).get());
    let cards = await Promise.all(cardRefs);
    cards = cards.map(card => convertDoc(card));
    return Promise.resolve(cards);
  } catch(error) {
    console.error(error);
    return Promise.resolve([]);
  }
}

pokeCard.search = async (key, value) => {
  try {
    return db.collection('pokemon_cards').where(key, '==', value).get()
    .then(function(snapshot) {
      let cards = convertSnapshot(snapshot);
      return cards;
    })
  } catch(error) {
    console.error(error);
  }
}

const updateAllCards = async () => {
  let cards = await pokeCard.getLanguage('japanese');
  let allSets = await pokeSet.search('series_name', 'Pokemon XY');
  allSets = allSets.map(set => set.id);
  let sets = new Set(allSets);
  let special = [];
  let updates = [];

  cards.forEach((card, i) => {
    if (isExCard(card.name) && sets.has(card.set_id)) {
      special.push(card.name);
      // updates.push(pokeCard.update(card.id, { finishes: [ 'holo' ], full_art: false }))
    }
  });

  console.log('updating :', updates.length, special);
  await Promise.all(updates);
  console.log('updated all cards');
}

// updateAllCards()


export default pokeCard;
