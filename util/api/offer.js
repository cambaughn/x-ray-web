import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import { isSpecialCard, isExCard } from '../helpers/string';

const offer = {};

offer.create = async (user_id) => {
  let newOffer = {
    items: [],
    last_updated: null,
  }

  try {
    return db.collection('offers').doc(user_id).set(newOffer);
  } catch(error) {
    console.error(error);
  }
}



offer.get = async (id) => {
  try {
    if (id) { // get specific card
      let offer = await db.collection('offers').doc(id).get();
      return offer.exists ? convertDoc(offer) : null;
    } else { // get all cards
      return db.collection('offers').get()
      .then(function(snapshot) {
        let sets = convertSnapshot(snapshot);
        return sets;
      })
    }
  } catch(error) {
    console.error(error);
  }
}


export default offer;
