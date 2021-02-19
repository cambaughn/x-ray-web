import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';

const getSalesForCard = async (card_id) => {
  try {
    let sales = await db.collection('en_pokemon_sales').where('card_id', '==', card_id).get();
    sales = convertSnapshot(sales);
    sales = sales.filter(sale => sale.status !== 'removed');
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

const removeSale = async (sale_id) => {
  if (sale_id) {
    db.collection('en_pokemon_sales').doc(sale_id).update({ status: 'removed' });
    console.log('removed sale');
  }
}


export { getSalesForCard, removeSale }
