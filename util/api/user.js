import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';
import { addUserToIndex } from '../algolia/algoliaHelpers';
import analytics from '../analytics/segment';

const userAPI = {}

userAPI.get = async (id) => {
  try {
    let user = await db.collection('users').doc(id).get();
    user = convertDoc(user);
    return Promise.resolve(user);
  } catch(error) {
    console.error(error);
  }
}

userAPI.update = async (id, updates) => {
  try {
    return db.collection('users').doc(id).set(updates, { merge: true });
  } catch(error) {
    console.error(error);
  }
}

userAPI.exists = async (id) => {
  try {
    let userDoc = await db.collection('users').doc(id).get();
    return Promise.resolve(userDoc.exists);
  } catch(error) {
    console.error(error);
  }
}

userAPI.create = async (email) => {
  try {
    let user = await userAPI.get(email);
    if (!user.email) {
      let newUser = {
        email,
        username: null,
        name: null
      }
      await db.collection('users').doc(email).set(newUser, { merge: true });
      user = await userAPI.get(email);

      // Track sign up
      analytics.track({
        userId: email,
        event: 'Signed up'
      });
    }
    return Promise.resolve(user);
  } catch(error) {
    console.error(error);
  }
}

export default userAPI;
