import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import pokeCard from './card';


const getCardsWithoutImages = async () => {
  try {
    return db.collection('en_pokemon_cards').where('hero_image', '==', null).limit(20).get()
    .then((snapshot) => {
      let cards = convertSnapshot(snapshot);
      return cards;
    })
  } catch(error) {
    console.log(error);
  }
}


// CAREFUL
const removeAllHeroImages = async () => {
  let cards = await pokeCard.get();
  let updateRefs = cards.map(card => pokeCard.update(card.id, { hero_image: null }))
  await Promise.all(updateRefs);
  console.log('removed hero images');
}


export { getCardsWithoutImages }
