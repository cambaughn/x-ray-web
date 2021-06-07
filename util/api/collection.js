import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';
import { nanoid } from 'nanoid';
import { sortCollectionByDate } from '../helpers/sorting';

let collectedItem = {};

collectedItem.create = async (item) => {
  if (item.item_id && item.user_id) {
    let id = nanoid();
    return db.collection('collected_items').doc(id).set(item);
  } else {
    return Promise.resolve(true);
  }
}

collectedItem.delete = async (item) => {
  if (item.id) {
    return db.collection('collected_items').doc(item.id).delete();
  } else {
    return Promise.resolve(true);
  }
}

collectedItem.archive = async (item) => {
  if (item.id) {
    let updates = { status: 'archived' }
    return db.collection('collected_items').doc(item.id).set(updates, { merge: true });
  } else {
    return Promise.resolve(true);
  }
}

// Statuses: approved, rejected, pending, incorrect_card, deleted
collectedItem.update = async (id, updates) => {
  try {
    return db.collection('collected_items').doc(id).set(updates, { merge: true });
  } catch(error) {
    console.error(error);
  }
}


collectedItem.getForUser = async (user_id) => {
  try {
    let items = await db.collection('collected_items').where('user_id', '==', user_id).get()
    items = convertSnapshot(items);
    items = items.filter(item => item.status !== 'archived');
    items = sortCollectionByDate(items);
    return Promise.resolve(items);
  } catch(error) {
    console.error(error);
    return Promise.resolve([]);
  }
}

export default collectedItem;
