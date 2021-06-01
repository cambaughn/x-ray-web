import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';
import { flatten } from '../helpers/array';

const formattedSale = {}

formattedSale.getForItem = async (item_id) => {
  try {
    let sales = await db.collection('formatted_sales').where('item_id', '==', item_id).get();
    sales = convertSnapshot(sales);
    sales = sales.filter(sale => sale.status !== 'rejected');
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

formattedSale.getForMultiple = async (item_ids) => {
  try {
    let salesRefs = item_ids.map(item_id => formattedSale.getForItem(item_id));
    let salesForAll = await Promise.all(salesRefs);
    salesForAll = flatten(salesForAll);
    return Promise.resolve(salesForAll);
  } catch(error) {
    console.error(error);
  }
}


export { formattedSale as default }
