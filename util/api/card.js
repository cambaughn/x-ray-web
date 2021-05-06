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

const updateAllCards = async () => {
  let cards = await pokeCard.get();

  let updates = cards.map((card, i) => {
    // let finishes = [];
    // if (isSpecialCard(card.name) || card.name.toLowerCase().slice(card.name.length - 2) === ' v') {
    //   finishes.push('holo');
    // }

    return pokeCard.update(card.id, { variants: [] })
  });

  console.log('updating :', updates.length);
  await Promise.all(updates)
  console.log('updated all cards');
}

// updateAllCards()


export default pokeCard;
