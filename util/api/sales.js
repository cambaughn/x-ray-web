import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';

const sale = {};

sale.getForCard = async (card_id) => {
  try {
    let sales = await db.collection('pokemon_sales').where('card_id', '==', card_id).where('status', '==', 'pending').limit(50).get();
    sales = convertSnapshot(sales);
    sales = sales.filter(sale => sale.status !== 'removed');
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

sale.update = async (id, updates) => {
  try {
    return db.collection('pokemon_sales').doc(id).set(updates, { merge: true });
  } catch(error) {
    console.error(error);
  }
}

sale.reject = async (sale_id) => {
  try {
    if (sale_id) {
      await sale.update(sale_id, { status: 'rejected' });
      console.log('rejected sale ', sale_id);
      Promise.resolve(true);
    }
  } catch(error) {
    console.error(error);
  }
}


export default sale;
