import db from '../firebase/firebaseInit';
import firebase from "firebase/app";
import "firebase/storage";

const card_images = {};

card_images.getForSet =  async (set_name) => {
  let storageRef = firebase.storage().ref();
  let images = await storageRef.child(`card_images/${set_name}`).listAll();
  images = await images.items.map(async item => {
    let path = await storageRef.child(item.fullPath).getDownloadURL();
    return path;
  })

  return Promise.all(images);
}


export default card_images;
