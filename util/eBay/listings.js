import cheerio from 'cheerio';
import axios from 'axios';
import db from '../firebase/firebaseInit';
import pokeCard from '../api/card.js';
import sale from '../api/sales.js';
import { convertToUSD, currencyMap } from '../helpers/currency.js';
import { getNowAsStringWithTime } from '../helpers/date.js';
import { checkForUnhandledName, createCardSearchNames } from './helpers.js';
import fs from 'fs';
import { makeProxyRequest } from './proxy/proxyHelpers';

const gradeMap = {
  BECKETT: 'BGS',
  BECKET: 'BGS',
}

// Request cards from database that we will want to search
const getCardsToSearch = async (startingPoint, limit) => {
  try {
    let cards = await pokeCard.getFrom(startingPoint, limit);
    // let cards = await pokeCard.get('swsh4-188');
    let searchForCardsWithoutSales = false;

    // This gives us the ability to look only for cards without sales
    if (searchForCardsWithoutSales) {
      let sales = await sale.get();
      let salesLookup = {};
      // Create lookup for each sale, just letting us know which cards have sales already
      sales.forEach(sale => {
        salesLookup[sale.card_id] = true;
      });

      // Filter out all the cards that have already been found
      let unfoundCards = cards.filter(card => !salesLookup[card.id]);

    }

    // For testing, only getting single pikachu card
    // let pikachu = cards.filter(card => card.name === 'Pikachu VMAX');
    // cards = pikachu;

    // return unfoundCards.slice(1000, 2000);
    return cards;
  } catch(error) {
    console.error(error);
  }
}
// after completed search for Seaking - Sword & Shield - 47

const configureSearchTerms = (card, attempt) => {
  let terms = [card.search_name, card.search_set_name, card.number];
  if (attempt > 1) {
    terms.pop();
  }
  return terms.map(term => {
    return term.trim()
  })
  .join(' ')
  .replace(/\s/g, '+');
}

const configureUrl = (card, pageNum = 1, attempt) => {
  const baseUrl = 'https://www.ebay.com/sch/i.html?_from=R40';
  const sold = '&LH_Sold=1';
  const complete = '&LH_Complete=1';
  const itemsPerPage = '&_ipg=200';
  const pageParam = `&_pgn=${pageNum}`;
  const ignoredTerms = attempt > 1 ? [] : ['repack', 'custom', 'PTCGO', 'online', 'mystery', 'lot', 'read', 'nendoroid', 'digital'];
  const ignoredString = ignoredTerms.length > 0 ? '+-' + ignoredTerms.join('-') : '';

  const url = `${baseUrl}&_nkw=${configureSearchTerms(card, attempt)}${ignoredString + sold + complete + itemsPerPage + pageParam}`;
  console.log(url);
  return url;
}

/**
 * Download data from the specified URL.
 *
 * @async
 * @function getSearchLinksForPage
 * @param {object} card - The card details
 * @return {Promise<array>} The array of links to listings as individual strings.
 */
const getSearchLinksForPage = async (card, url) => {
  try {
    let searchPage = await makeProxyRequest(url);
    let $ = cheerio.load(searchPage, null, false);

    if ($("title").text() === 'Security Measure') {
      console.log('----Hit Captcha----');

      searchPage = await makeProxyRequest(url);
      $ = cheerio.load(searchPage, null, false);

      if ($("title").text() === 'Security Measure') {
        console.log('----Hit Captcha a second time----');
      }
    }

    let links = $("div.s-item__info").map(function() {
      let link = $(this).find('a.s-item__link').attr('href');
      let sellingType = $(this).find('span.s-item__purchase-options-with-icon');
      let bestOfferAccepted = sellingType && sellingType.text() === 'Best offer accepted';

      if (!bestOfferAccepted) {
        return link;
      } else {
        return null;
      }
    }).get();

    links = links.filter(link => !!link);

    return Promise.resolve(links || []);
  } catch(error) {
    console.error(error);
    return Promise.resolve([]);
  }
}





// grade: [num]
// grading_authority: [string] - PSA, BGS, CGC

// price: [num]
// currency: [string]
// title: [string]
// location: [string]
// date_sold: [string]
// time_sold: [string]
// condition: [string]
// site: [string] "ebay"
// card_id: [string]
// type: [string] auction, buy_now
// num_bids: [num]

// This is the bulk of the logic for finding everything on the page and extracting it into an object that we can hand back up the chain
const getInfoForCard = async (card, link) => {
  try {
    let saleInfo = {
      site: 'ebay',
      card_id: card.id,
      url: link,
      status: 'pending',
    };

    let page = await axios.get(link);
    page = page.data;
    const $ = cheerio.load(page, null, false);

    // Get item number
    saleInfo.item_number = $('div#descItemNumber').text().trim();

    // Get date/time info
    let dateInfo = $('span#bb_tlft').text();
    dateInfo = dateInfo.replace(/[\t\r\n]/g, '').replace('</span>', '').split('<span>');
    let date_sold = dateInfo[0];
    let time_sold = dateInfo[1];
    saleInfo.date_sold = date_sold || null;
    saleInfo.time_sold = time_sold || null;

    // Get title
    saleInfo.title = $('h1#itemTitle').text().replace('Details about', '').trim() || null;

    // Get condition
    saleInfo.condition = $('div#vi-itm-cond').text().trim() || null;
    saleInfo.graded_condition = $('td.attrLabels:contains("Card Condition:")').next().text().trim() || null;

    // Location
    saleInfo.location = $('div.u-flL:contains("Item location")').next().text().trim() || null;

    // Listing image
    saleInfo.listing_image = $('img#icImg').attr('src') || null;

    // Seller Info
    saleInfo.seller = $('span.mbg-nw').text().trim() || null;

    // Sale type
    let type = $('div#prcIsum-lbl').text().trim().length > 0 ? 'buy_now' : 'auction';
    saleInfo.type = type;

    // Price info - currency and sale price
    let priceDetails = type === 'buy_now' ? $('span#prcIsum') : $('span.vi-VR-cvipPrice');
    priceDetails = priceDetails.text().trim().split(' ');
    saleInfo.price = priceDetails[1] ? parseFloat(priceDetails[1].replace('$', '').replace(',', '')) : null;
    saleInfo.currency = priceDetails[0] === 'US' ? 'USD' : priceDetails[0];

    if (saleInfo.currency !== 'USD' && saleInfo.price) {
      saleInfo.currency = currencyMap[saleInfo.currency] || saleInfo.currency;
      // let newPrice = await convertCurrency(saleInfo.currency, 'USD', saleInfo.price);

      let newPrice = convertToUSD(saleInfo.currency, saleInfo.price);

      // console.log(`new price: ${newPrice}, original price: ${saleInfo.price} ${saleInfo.currency}`);
      if (newPrice) {
        saleInfo.price = newPrice;
        saleInfo.original_currency = saleInfo.currency;
        saleInfo.currency = 'USD';
      }
    }

    // Get number of bids if type === 'auction'
    if (saleInfo.type === 'auction') {
      let num_bids = parseInt($('a#vi-VR-bid-lnk').find('span').eq(0).text().trim()) || null;
      saleInfo.num_bids = num_bids;
    }

    // Grading info
    saleInfo.grade = $('td.attrLabels:contains("Grade:")').next().text().trim() || null;
    let grading_authority = $('td.attrLabels:contains("Professional Grader")').next().text().trim() || null;

    // Translate full grader name into shortened/standardized version
    if (grading_authority) {
      if (grading_authority.includes('PSA')) {
        grading_authority = 'PSA';
      } else if (grading_authority.includes('BGS')) {
        grading_authority = 'BGS';
      } else if (grading_authority.includes('CGC')) {
        grading_authority = 'CGC';
      } else if (grading_authority.includes('GMA')) {
        grading_authority = 'GMA';
      }
    }

    // If it has a grade in the specifics, but not a grading authority, search for it in the title
    if (saleInfo.grade !== null) {
      // Checking again for PSA, because sometimes CGC listings have PSA in the specifics - incorrectly
      if (!grading_authority || grading_authority === 'PSA') {
        // Including both "Beckett" (correct spelling) and "Becket" as it's commonly misspelled
        let graders = ['CGC', 'PSA', 'BGS', 'BECKETT', 'BECKET', 'GMA'];
        let searchTitle = saleInfo.title.toUpperCase();

        for (let i = 0; i < graders.length; i++) {
          if (searchTitle.includes(graders[i])) {
            grading_authority = gradeMap[graders[i]] || graders[i];
            break;
          }
        }
      }
    }

    saleInfo.grading_authority = grading_authority;

    // Last thing is to perform checks on the set, card type, rarity, specialty, and character in order to verify that this is the card we're meant to get
    // These three are hard-coded checks
    let language = $('td.attrLabels:contains("Language:")').next().text().trim() || null;
    let game = $('td.attrLabels:contains("Game:")').next().text().trim() || null;
    let card_type = $('td.attrLabels:contains("Card Type:")').next().text().trim() || null;

    // These three are checks against the card we're looking at
    let character = $('td.attrLabels:contains("Character:")').next().text().split(' ')[0].replace(',', '').trim() || null;
    let set = $('td.attrLabels:contains("Set:")').next().text().trim() || null;
    let rarity = $('td.attrLabels:contains("Rarity:")').next().text().trim() || null;
    let number = $('td.attrLabels:contains("Card Number:")').next().text().trim() || null;

    let checkObject = { language, game, card_type, character, set, rarity };
    let checkKeys = Object.keys(checkObject);
    let incorrectListing = false;
    let i = 0;

    // Go through each of the checks and perform it
    while (!incorrectListing && i < checkKeys.length) {
      let key = checkKeys[i];
      let value = checkObject[key];
      // Only check for correct value if there is a value, i.e. if the listing has that specific
      if (value) { // value is not null - it's been explicitly assigned
        value = value.toLowerCase();
        switch(key) {
          case 'language':
            incorrectListing = value !== 'english' && value !== 'en';
            break;
          case 'game':
            incorrectListing = !value.includes('pokémon') && !value.includes('pokemon');
            break;
          // case 'card_type':
          //   incorrectListing = value !== 'pokémon' && value !== 'pokemon';
          //   break;
          case 'character':
            incorrectListing = card.name && !card.name.toLowerCase().includes(value);
            break;
          case 'number':
            incorrectListing = card.number && !card.number === value;
            break;
          case 'set':
            incorrectListing = card.set && !card.set.toLowerCase().includes(value);
            break;
          // case 'rarity':
          //   incorrectListing = card.rarity && !card.rarity.toLowerCase().includes(value);
          //   break;
          default:
            incorrectListing = false;
        }

        // if (incorrectListing) {
        //   console.log(`incorrect ${key}: ${value} - ${link}`);
        // }
      }

      i++;
    }

    if (incorrectListing) {
      saleInfo = null;
    }

    return Promise.resolve(saleInfo);
  } catch(error) {
    console.error(error);
  }
}

// Iterate through all links and get sales data from individual listing page - utilize getInfoForCard function to get for a single card
const getSalesInfoForCards = async (card, links) => {
  try {
    const info = links.map(link => getInfoForCard(card, link));
    return Promise.all(info);
  } catch(error) {
    console.error(error);
  }
}

const findLinksForCard = async (card, attempt = 1) => {
  try {
    let links = [];
    let linkLookup = {};
    let keepSearching = true;
    let page = 1;

    // Basically, increment through the search pages until we get the same page twice
    while (keepSearching) {
      let url = configureUrl(card, page, attempt);
      let searchedLinks = await getSearchLinksForPage(card, url);
      console.log('page: ', page, ', links: ', searchedLinks.length);

      if (searchedLinks.length > 0) {
        for (let i = 0; i < searchedLinks.length; i++) {
          let link = searchedLinks[i];
          if (!linkLookup[link]) {
            links.push(link);
            linkLookup[link] = true;
          } else {
            keepSearching = false;
            break;
          }
        }
      } else {
        keepSearching = false;
      }

      page++;
    }

    // Make sure none of the links are null
    links = links.filter(link => !!link);
    return Promise.resolve(links);
  } catch(error) {
    console.error(error);
  }
}


// Search ebay for card
// Specifically, this function handles getting all the links from every search page, then passes those links off to a separate function to get info from the pages
const updateSalesForCard = async (card) => {
  try {
    // Create search_name and set_search_name
    card = createCardSearchNames(card);

    // Check for name that isn't handled by our string helpers
    if (checkForUnhandledName(card)) { // if the name can't be handled, return updated = false
      return Promise.resolve(false);
    }

    let attempt = 1;
    let links = await findLinksForCard(card, attempt);

    console.log('links => ', links.length);
    if (links.length === 0) {
      attempt++;
      links = await findLinksForCard(card, attempt);
      console.log('links => ', links.length);
    }

    // Go to each of the links and get the details from each
    let salesInfo = await getSalesInfoForCards(card, links);
    salesInfo = salesInfo.filter(info => !!info);

    let salesForCard = await sale.getForCard(card.id);
    let existingSales = {};

    salesForCard.forEach(sale => {
      existingSales[sale.id] = true;
    })


    console.log('all links found:', links.length);
    console.log('listings with data: ', salesInfo.length);

    let uploadRefs = salesInfo.filter(sale => !existingSales[sale.item_number]).map(listing => sale.create(listing));
    await Promise.all(uploadRefs);

    console.log('uploaded: ', uploadRefs.length);

    if (links.length > 0) { // only update the card if we were able to find links
      // Update the card itself to say when it was last updated
      let cardUpdate = {
        last_updated: getNowAsStringWithTime()
      }

      await pokeCard.update(card.id, cardUpdate);
    }

    // Completed updating card
    return Promise.resolve(true);
  } catch(error) {
    console.error(error);
    Promise.resolve(false);
  }
}


const handleSearch = async () => {
  try {
    let searched = 0;
    let limit = 50;
    let lastCard = null;
    let cards;

    do {
      // First, find the cards we'll be searching ebay for
      cards = await getCardsToSearch(limit, lastCard);

      let unhandledNames = checkForUnhandledNames(cards);

      if (unhandledNames) {
        break;
      }


      for (let i = 0; i < cards.length; i++) {
        // Then, await searching for each card separately (otherwise the volume gets too high
        // for each card there can be thousands of ebay listings)

        let card = cards[i];
        console.log(`starting search for ${card.name} - ${card.set_name} - ${card.number}` );
        await searchForCard(card);
        console.log(`completed search for ${card.name} - ${card.set_name} - ${card.number}` );
        console.log('-----------');
      }

      searched += limit;
      lastCard = cards[cards.length - 1].name;
      console.log(`searched for ${searched} cards`);
      console.log('-----------');
    } while (cards.length >= limit);

    console.log('completed all');
  } catch(error) {
    console.error(error);
  }
}

// searchSingleCard('swsh4-188');

export { updateSalesForCard }
