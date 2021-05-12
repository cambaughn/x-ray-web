import db from '../firebase/firebaseInit.js';

const pokeSeries = {};

pokeSeries.create = async (id, newSeries) => {
  try {
    return db.collection('en_pokemon_series').doc(id).set(newSeries);
  } catch(error) {
    console.error(error);
  }
}

export default pokeSeries;
