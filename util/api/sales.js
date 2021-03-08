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

sale.getPending = async () => {
  try {
    let sales = await db.collection('pokemon_sales').where('status', '==', 'pending').orderBy('card_id').limit(50).get();
    // let sales = await db.collection('pokemon_sales').where('status', '==', 'pending').limit(50).get();
    sales = convertSnapshot(sales);
    console.log('getting sales ', sales);
    let card_id = sales[0] ? sales[0].card_id : null;
    if (card_id) {
      // Keep only sales for a single card
      sales = sales.filter(sale => sale.card_id === card_id);
    }
    return Promise.resolve(sales);
  } catch(error) {
    console.error(error);
  }
}

// Statuses: approved, rejected, pending, incorrect_card, deleted
sale.update = async (id, updates) => {
  try {
    return db.collection('pokemon_sales').doc(id).set(updates, { merge: true });
  } catch(error) {
    console.error(error);
  }
}

sale.approve = async (sale_id) => {
  try {
    await sale.update(sale_id, { status: 'approved' });
    Promise.resolve(true);
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

// db.collection('pokemon_sales').where('status', '==', 'pending').get()
// .then(async (listings) => {
//   listings = convertSnapshot(listings);
//   listings = listings.filter(listing => listing.card_id !== 'swsh4-188');
//   console.log('listings here ', listings);
//   let updateRefs = listings.map(listing => sale.update(listing.id, { status: 'deleted' }))
//   console.log('updating listings');
//   await Promise.all(updateRefs)
//   console.log('deleted all listings not for pikachu card');
// })


export default sale;
