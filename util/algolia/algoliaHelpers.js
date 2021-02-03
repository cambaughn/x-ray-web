import index from './algoliaInit';


const searchCard = async (searchTerm) => {
  try {
    let result = await index.search(searchTerm);
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

export { searchCard, configureSearchTerm };
