import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';

const getSalesForCard = async (card_id) => {
  try {
    let sales = await db.collection('en_pokemon_sales').where('card_id', '==', card_id).get();
    sales = convertSnapshot(sales);
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

export { getSalesForCard }
