import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';

const sale = {};

sale.getForCard = async (card_id) => {
  try {
    console.log('getting sales data for ', card_id);
    let sales = await db.collection('pokemon_sales').where('card_id', '==', card_id).get();
    sales = convertSnapshot(sales);
    sales = sales.filter(sale => sale.status !== 'removed');
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

sale.reject = async (sale_id) => {
  if (sale_id) {
    db.collection('pokemon_sales').doc(sale_id).update({ status: 'rejected' });
    console.log('rejected sale');
  }
}


export default sale;
