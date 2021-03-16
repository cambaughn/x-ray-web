import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';

const userAPI = {}

userAPI.get = async (id) => {
  try {
    let user = await db.collection('users').doc(id).get();
    return Promise.resolve(convertDoc(user));
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
    }
    return Promise.resolve(user);
  } catch(error) {
    console.error(error);
  }
}

export default userAPI;
