import db from '../firebase/firebaseInit';
import { convertSnapshot, convertDoc } from './general';

const getUser = async (id) => {
  try {
    let user = await db.collection('users').doc(id).get();
    return Promise.resolve(convertDoc(user));
  } catch(error) {
    console.error(error);
  }
}

const createUser = async (id, newUser) => {
  try {
    return db.collection('users').doc(id).set(newUser, {merge: true});
  } catch(error) {
    console.error(error);
  }
}

const loginUser = async (authUser) => {
  try {
    let id = authUser.email;
    let user = await getUser(id);
    if (user.exists) {
      return Promise.resolve(convertDoc(user));
    } else {
      await createUser(id, authUser);
      return getUser(id);
    }
  } catch(error) {
    console.error(error);
  }
}

export { getUser, createUser, loginUser }
