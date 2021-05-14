import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import { isSpecialCard } from '../helpers/string';

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
  let cards = await pokeCard.search('set_id', 'swsh4');
  let special = [];

  let updates = cards.map((card, i) => {
    let finishes = [];
    if (isSpecialCard(card.name) || card.name.toLowerCase().slice(card.name.length - 2) === ' v') {
      finishes.push('holo');
      special.push(card.name)
    }

    return pokeCard.update(card.id, { finishes })
  });

  console.log('updating :', updates.length, special);
  await Promise.all(updates);
  console.log('updated all cards');
}



export default pokeCard;
