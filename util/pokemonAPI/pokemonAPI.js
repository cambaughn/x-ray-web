import pokemon from 'pokemontcgsdk';

pokemon.configure({apiKey: 'd73b3b77-aa37-44f8-9438-b39f162745aa'});

const getCardInfo = async (card_id) => {
  try {
    return pokemon.card.find(card_id);
  } catch(error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

const searchCard = async (card) => {
  try {
    let cardInfo = await pokemon.card.where({ q: `name:"${card.name}" number:${card.number}` });
    cardInfo = cardInfo.data;
    cardInfo = cardInfo[0] || {};
    // console.log('getting cardInfo ', cardInfo);
    return cardInfo;
  } catch(error) {
    console.error(error);
  }
}

export { getCardInfo, searchCard };
