import db from '../firebase/firebaseInit.js';
import { convertSnapshot, convertDoc } from './general';

const pokeSet = {};

// Be careful with this one, it doesn't check whether it already exists first
pokeSet.create = async (id, newSet) => {
  try {
    return db.collection('pokemon_sets').doc(id).set(newSet);
  } catch(error) {
    console.error(error);
  }
}

pokeSet.search = async (key, value) => {
  try {
    return db.collection('pokemon_sets').where(key, '==', value).get()
    .then(function(snapshot) {
      let sets = convertSnapshot(snapshot);
      return sets;
    })
  } catch(error) {
    console.error(error);
  }
}

pokeSet.get = async (id) =>  {
  try {
    if (id) { // get specific set
      return db.collection('pokemon_sets').doc(id).get()
      .then(function(doc) {
        return convertDoc(doc);
      })
    } else { // get all sets
      return db.collection('pokemon_sets').get()
      .then(function(snapshot) {
        let sets = convertSnapshot(snapshot);
        return sets;
      })
    }
  } catch(error) {
    console.error(error);
  }
}

pokeSet.update = async (id, updates) => {
  try {
    return db.collection('pokemon_sets').doc(id).update(updates)
  } catch(error) {
    console.error(error);
  }
}

const checkSets = async () => {
  let sets = await pokeSet.get();
  console.log('sets =>', sets );
}


export default pokeSet;
