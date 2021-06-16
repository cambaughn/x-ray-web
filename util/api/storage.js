import db from '../firebase/firebaseInit';
import firebase from "firebase/app";
import "firebase/storage";

const cardFolderMap = {
  'Pokekyun Collection': 'PokeKyun Collection',
  'Mega Rayquaza EX Battle Deck': 'Mega Battle Deck M Rayquaza EX',
  'Garchomp Half Deck': 'Garchomp Half Deck',
  'Pokemon VS': 'VS',
  'Cold Flare': 'Ice Burn',
  'Magma Gang vs Aqua Gang: Double Crisis': 'Team Magma VS Team Aqua Double Crisis',
  'Jet Black Spirit': 'Jet Black Poltergeist',
  'Tag Team GX All Stars': 'Tag All Stars',
  'Forbidden Light': 'Forbidden Light Jp',
  'Rebellion Crash': 'Rebellious Clash',
  'Miracle Twins': 'Miracle Twin',
  'Legendary Pulse': 'Legendary Beat',
  'Ultra Shiny GX': 'GX Ultra Shiny',
  'Detective Pikachu': 'Great Detective Pikachu',
  'Bandit Ring': 'Banded Ring',
  'Alola Moonlight': 'Alolan Moonlight',
  'The Awoken Hero': 'Awakening Hero',
  'Islands Awaiting You': 'Islands Await You',
  'Ultra Force': 'Ultra Forces',
  'Golduck BREAK & Palkia EX Combo Deck': 'Break Combo Deck Golduck BREAK Palkia EX',
  'Raichu BREAK Evolution Pack': 'Break Evolution Pack Raichu BREAK',
  'Ruthless Rebel': 'Cruel Traitor',
  'Premium Champion Pack: EX x M x BREAK': 'Premium Champion Pack EX M BREAK',
  'Legendary Holo Collection': 'Legendary Shiny Collection',
  'Seen the Rainbow Battle': 'Did You See The Fighting Rainbow',
  'Explosive Flame Walker': 'Explosive Walker',
  'Light-Consuming Darkness': 'Light-Devouring Darkness',
  'The Transdimensional Beast': 'Ultra Dimensional Beast',
  'Strengthening Expansion Pack: Beyond A New Challenge': 'Beyond A New Challenge',
  'Awakening of Psychic Kings': 'Awakening Psychic Champion',
}

const card_images = {};

card_images.getForSet =  async (set_name) => {
  let storageRef = firebase.storage().ref();
  let images = await storageRef.child(`card_images/${cardFolderMap[set_name] || set_name}`).listAll();
  images = await images.items.map(async item => {
    let path = await storageRef.child(item.fullPath).getDownloadURL();

    let fileName = item.fullPath.split('/')[2].replace('.jpg', '');
    let pieces = fileName.split('-');

    let details = {
      url: path,
      number: pieces[0],
      name: pieces[1]
    };

    return details;
  })

  return Promise.all(images);
}


export default card_images;
