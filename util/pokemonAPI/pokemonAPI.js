// import pokemon from 'pokemontcgsdk';
const pokemon = require('pokemontcgsdk');

const getCardInfo = async (card) => {
  try {
    let cardInfo = await pokemon.card.where({ name: card.name, number: card.number, set: card.set_title });
    cardInfo = cardInfo[0] || {};
    return cardInfo;
  } catch(error) {
    console.error(error);
  }
}

export { getCardInfo };
