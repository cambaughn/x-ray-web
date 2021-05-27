import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';

const formattedSale = {}

formattedSale.getForCard = async (item_id) => {
  try {
    let sales = await db.collection('formatted_sales').where('item_id', '==', item_id).get();
    sales = convertSnapshot(sales);
    sales = sales.filter(sale => sale.status !== 'rejected');
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}


export { formattedSale as default }
