import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';

// Collection in database is psa_pop_reports
const psaPopReport = {};

psaPopReport.get = (id) => {
  return db.collection('psa_pop_reports').doc(id).get();
}

psaPopReport.search = (key, value) => {
  try {
    return db.collection('psa_pop_reports').where(key, '==', value).get()
    .then(function(snapshot) {
      let cards = convertSnapshot(snapshot);
      return cards;
    })
  } catch(error) {
    console.error(error);
  }
}

export default psaPopReport;
