import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import pokeSet from './set';

const pokeSeries = {};

pokeSeries.create = async (newSeries) => {
  try {
    return db.collection('pokemon_series').doc(newSeries.name).set(newSeries);
  } catch(error) {
    console.error(error);
  }
}

pokeSeries.get = async (id) =>  {
  try {
    if (id) { // get specific set
      return db.collection('pokemon_series').doc(id).get()
      .then(function(doc) {
        return convertDoc(doc);
      })
    } else { // get all sets
      return db.collection('pokemon_series').get()
      .then(function(snapshot) {
        let sets = convertSnapshot(snapshot);
        return sets;
      })
    }
  } catch(error) {
    console.error(error);
  }
}


const migrateSeries = async () => {
  let setInfo = await pokeSet.get();
  let uniqueSeries = new Set();
  setInfo.forEach(set => {
    uniqueSeries.add(set.series);
    set.series === 'Other' && console.log(set);
  })
  let series = Array.from(uniqueSeries);
  series = series.map(name => {
    return { name, logo: '' }
  })

  // series.forEach(item => {
  //   pokeSeries.create(item);
  // })

  // console.log('series ', series);
}


export default pokeSeries;
