import cheerio from 'cheerio';
import axios from 'axios';
import db from '../../firebase/firebaseInit';
import pokeCard from '../api/card.js';
import sale from '../api/sales.js';
// import { convertCurrency } from '../currency.js';
// import { convertToUSD } from '../currencyHelpers.js';
import { hasNonAlphanumeric, replaceCharacters } from '../stringHelpers.js';
import request from 'postman-request';
import fs from 'fs';
import { makeProxyRequest } from '../proxy/proxyHelpers';

const updateSalesForCard = () => {

}

export { updateSalesForCard }
