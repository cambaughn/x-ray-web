import { Client } from "@notionhq/client";
import { notion_api_key, cardsId, setsId, seriesId } from "./notionSecrets";
import pokeSeries from "../api/series";
import pokeSet from "../api/set";
import { releaseStringToObject } from "../helpers/date";
import util from 'util';


const notion = new Client({ auth: notion_api_key });

const logObject = (objectToLog) => {
  console.log(util.inspect(objectToLog, false, null, true /* enable colors */))
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    "url": url
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


const addItem = async (item) => {
  try {
    return notion.pages.create(item)

  } catch (error) {
    console.error(error.body)
  }
}

// series_id: 'Black & White JPN',

// Sets
const uploadSets = async () => {
  // Get series, create map of ids
  // Get the whole series database
  let series = await getSeriesDatabase();
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
        "Pokellector Link": createUrl(set.url || null),
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

const getSeriesDatabase = () => {
  return notion.databases.query({ database_id: seriesId })
}

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

// formatSeries()
// uploadSets();


