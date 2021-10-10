import { Client } from "@notionhq/client";
import { notion_api_key, cardsId, setsId, seriesId } from "./notionSecrets";
import pokeSeries from "../api/series";
import pokeSet from "../api/set";
import pokeCard from '../api/card';
import { releaseStringToObject } from "../helpers/date";
import util from 'util';


const notion = new Client({ auth: notion_api_key });


const cardLanguages = {
  en: 'English',
  jp: 'Japanese'
}

const logObject = (objectToLog) => {
  console.log(util.inspect(objectToLog, false, null, true /* enable colors */))
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getNotionDatabase = async (database_id) => {
  let results = [];
  let start_cursor;

  do {
    let query = await notion.databases.query({ database_id, start_cursor });
    results = [ ...results, ...query.results ];
    start_cursor = query.next_cursor || undefined;
  } while (start_cursor);

  return Promise.resolve(results);
}

const createTitle = (text) => {
  !text && console.log('No title');
  return { 
    title: [
      {
        "text": {
          "content": text
        }
      }
    ]
  }
}

const createRichText = (text) => {
  !text && console.log('No rich text');
  return {
    "rich_text": [{
      "type": 'text',
      "text": {
        "content": text
      }
    }]
  }
}

const createNumber = (number) => {
  return {
    "number": number
  }
}

const createUrl = (url) => {
  return {
    "url": url || null
  }
}

const createDate = (startDate, endDate) => {
  let dateObject = {
    "date": {
      "start": startDate
    }
  }

  if (endDate) {
    dateObject.date.end = endDate;
  }

  return dateObject;
}

const createRelation = (page_id) => {
  return {
    "relation": [
      { "id": page_id }
    ]
  }
}

const createCheckbox = (bool) => {
  return {
    "checkbox": bool
  }
}

const createImageReference = (card) => {
  let url = card.images.large || card.images.small;
  if (url && !url.includes('firebase')) {
    return url;
  } else {

    return card.alternate_images?.large || card.alternate_images?.small || null
  }
}


const addItem = async (item) => {
  try {
    return notion.pages.create(item)

  } catch (error) {
    console.error(error.body)
  }
}


// Cards
const uploadCards = async () => {
  let sets = await getNotionDatabase(setsId);
  let setsLookup = {};
  sets.forEach(item => {
    setsLookup[item.properties.SetId.rich_text[0].plain_text] = item.id;
  })


  let firstCard = await pokeCard.get('S4A-JPN-307');
  // let firstCard = await pokeCard.get('sma-SV49');
  // console.log('first card', firstCard);
  let formattedCard = formatCard(firstCard, setsLookup[firstCard.set_id])
  logObject(formattedCard);

  addItem(formattedCard)
}


const formatCard = (card, setId) => {
  return {
    parent: { database_id: cardsId },
    properties: {
      title: createTitle(card.name),
      "Language": card.language === 'japanese' ? createRichText('Japanese') : createRichText('English'),
      "Number": createRichText(card.number),
      "Rarity": createRichText(card.rarity),
      "TCGPlayer URL": createUrl(card.tcgplayer_url),
      "Full Art": createCheckbox(card.full_art),
      "Set": createRelation(setId)
    },
    children: [
      {
        object: 'block',
        "type": "image",
        "image": {
          "type": "external",
          "external": {
              "url": createImageReference(card)
          }
        }
      }
    ]
  }
}




// Sets
const uploadSets = async () => {
  // Get series, create map of ids
  // Get the whole series database
  let series = await getNotionDatabase(seriesId);
  let seriesLookup = {};
  series.results.forEach(item => {
    seriesLookup[item.properties.DatabaseId.rich_text[0].plain_text] = item.id;
  })

  let sets = await pokeSet.get();

  let formattedSets = sets.map(set => {
    let notionObject = {
      parent: { database_id: setsId },
      properties: {
        title: createTitle(set.name),
        "Language": set.language ? createRichText(capitalizeFirstLetter(set.language)) : createRichText('English'),
        "SetId": createRichText(set.id),
        "Total Cards": createNumber(set.total),
        "Printed Total": createNumber(set.printedTotal),
        "PSA Pop Link": createUrl(set.psa_pop_urls[0] || null),
        "Release Date": createDate(releaseStringToObject(set.releaseDate)),
        "Series": createRelation(seriesLookup[set.series_id])
      },
      children: [
        {
          object: 'block',
          "type": "image",
          "image": {
            "type": "external",
            "external": {
                "url": set.images.logo || null
            }
          }
        }
      ]
    }

    return notionObject;
  })


  // formattedSets.forEach(set => addItem(set));
}

// Series

const formatSeries = async () => {
  let allSeries = await pokeSeries.get();
  let formattedSeries = allSeries.map(series => {
    let notionObject = {
      parent: { database_id: seriesId },
      properties: {
        title: createTitle(series.name),
        "Language": createRichText(capitalizeFirstLetter(series.language)),
        "DatabaseId": createRichText(series.id)
      },
      children: [
        {
          object: 'block',
          "type": "image",
          "image": {
            "type": "external",
            "external": {
                "url": series.logo
            }
          }
        }
      ]
    }

    return notionObject;
  })

  formattedSeries.forEach(series => addItem(series));
}


uploadCards();
// formatSeries()
// uploadSets();


