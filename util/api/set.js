import db from '../firebase/firebaseInit';
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

pokeSet.getEnglish = async () =>  {
  try {
    return db.collection('pokemon_sets').where('language', '==', 'english').get()
    .then(function(snapshot) {
      let sets = convertSnapshot(snapshot);
      return sets;
    })
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
  let sets = await pokeSet.getEnglish();
  let toUpdate = sets.filter(set => set.series === 'Sword & Shield')
  let updateRefs = toUpdate.map(set => {
    const updates = {
      series_id: 'Sword & Shield',
      series_name: 'Sword & Shield'
    }
    // return pokeSet.update(set.id, updates);
  })
  await Promise.all(updateRefs)
  console.log('updated sets => ', toUpdate);
}



export default pokeSet;
