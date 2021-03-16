import { cardsIndex, usersIndex } from './algoliaInit';


const searchCard = async (searchTerm) => {
  try {
    let result = await cardsIndex.search(searchTerm);
    let hits = result.hits;
    return hits;
  } catch(error) {
    console.error(index);
  }
}

const configureSearchTerm = (listing) => {
  let character = listing.character ? listing.character.split(',')[0] : '';
  let set = listing.set || '';
  let rarity = listing.rarity || '';
  let searchTerm = `${character} ${set} ${rarity}`;

  return searchTerm;
}

const searchUser = async (searchTerm) => {
  try {
    let result = await usersIndex.search(searchTerm);
    let hits = result.hits;
    return hits;
  } catch(error) {
    console.error(index);
  }
}

const usernameAvailable = async(username) => {
  try {
    let lowercase = username.toLowerCase();
    let users = await searchUser(lowercase);
    let usernames = users.map(user => user.username.toLowerCase());
    let available = !usernames.includes(lowercase);
    return available;
  } catch(error) {
    console.error(index);
  }
}

const addUserToIndex = async(user) => {
  try {
    let userInfo = {
      objectID: user.id,
      ...user
    }
    await usersIndex.saveObject(userInfo);
    return Promise.resolve(true);
  } catch(error) {
    console.error(index);
  }
}

export { searchCard, configureSearchTerm, usernameAvailable, addUserToIndex };
