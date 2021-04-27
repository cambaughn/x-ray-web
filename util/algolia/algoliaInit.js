import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch('ZEPBQJNG65', 'f837574487b017764e57ec533a0ab665');
const cardsIndex = searchClient.initIndex('pokemon_cards');
const usersIndex = searchClient.initIndex('users');

export { searchClient, cardsIndex, usersIndex };
