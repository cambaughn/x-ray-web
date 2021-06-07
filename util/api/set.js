import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import { months } from '../helpers/date';

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

pokeSet.getJapanese = async () =>  {
  try {
    return db.collection('pokemon_sets').where('language', '==', 'japanese').get()
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

const updateReleaseDates = async () => {
  let sets = await pokeSet.getJapanese();
  let setUpdates = sets.map(set => {
    let dateDetails = set.releaseDate.split(' ');
    let month = months[dateDetails[0]] + 1;
    let day = dateDetails[1].replace(',', '').replace('nd', '').replace('st', '').replace('rd', '').replace('th', '');
    let year = dateDetails[2];
    if (!month) {
      console.log('could not find month ', dateDetails);
    }
    let newDate = `${year}/${month}/${day}`;

    // return pokeSet.update(set.id, { releaseDate: newDate })
  })

  await Promise.all(setUpdates);
  console.log('updated all');
}



export default pokeSet;
