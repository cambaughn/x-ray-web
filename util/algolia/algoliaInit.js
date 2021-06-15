import algoliasearch from 'algoliasearch';

const client = algoliasearch('ZEPBQJNG65', 'f837574487b017764e57ec533a0ab665');
const cardsIndex = client.initIndex('pokemon_cards');
const setsIndex = client.initIndex('pokemon_sets');
const usersIndex = client.initIndex('users');

export { cardsIndex, usersIndex, setsIndex };
