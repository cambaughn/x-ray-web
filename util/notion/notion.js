import { Client } from "@notionhq/client";
import { notion_api_key, cardsId, setsId, seriesId } from "./notionSecrets";
import pokeSeries from "../api/series";
import pokeSet from "../api/set";
import { releaseStringToObject } from "../helpers/date";

const notion = new Client({ auth: notion_api_key });

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


const createTitle = (text) => {
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

// releaseDate: '2012/3/16',
// series_id: 'Black & White JPN',


// Sets
const uploadSets = async () => {
  let sets = await pokeSet.get();
  let formattedSets = sets.map(set => {
    let notionObject = {
      parent: { database_id: setsId },
      properties: {
        title: createTitle(set.name),
        "Language": set.language ? createRichText(capitalizeFirstLetter(set.language)) : 'English',
        "SetId": createRichText(set.id),
        "Total Cards": createNumber(set.total),
        "Printed Total": createNumber(set.printedTotal),
        "PSA Pop Link": createUrl(set.psa_pop_urls[0] || null),
        "Pokellector Link": createUrl(set.url || null),
        "Release Date": createDate(releaseStringToObject(set.releaseDate))
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


  // console.log('got sets ', sets[sets.length - 5]);
  console.log('got sets ', formattedSets[10]);
  // addItem(formattedSets[12]);
  // NOTE: Need to add reference to series
  // Get series, create map of ids, then add to notion object for set
}

// Series
const addItem = async (item) => {
  try {
    return notion.pages.create(item)

  } catch (error) {
    console.error(error.body)
  }
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
uploadSets();


