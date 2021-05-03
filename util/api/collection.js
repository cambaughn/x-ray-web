import db from '../firebase/firebaseInit';
import { convertSnapshot } from './general';
import { nanoid } from 'nanoid';

let collectedItem = {};

collectedItem.create = async (item) => {
  if (item.item_id && item.user_id) {
    let id = nanoid();
    return db.collection('collected_items').doc(id).set(item);
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

export default collectedItem;
