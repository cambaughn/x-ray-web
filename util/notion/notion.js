import { Client } from "@notionhq/client";
import { notion_api_key, cardsId, setsId, seriesId } from "./notionSecrets";
import pokeSeries from "../api/series";

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

const addItem = async (text) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: seriesId },
      properties: {
        title: createTitle(text)
      }
    })
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body)
  }
}

const addItemToSeries = async (item) => {
  try {
    return notion.pages.create(item)

  } catch (error) {
    console.error(error.body)
  }
}


const addImageToPage = (pageId, imageSrc) => {
  return notion.blocks.children.append(

  )
}

const formatSeries = async () => {
  let allSeries = await pokeSeries.get();
  let formattedSeries = allSeries.map(series => {
    let notionObject = {
      parent: { database_id: seriesId },
      properties: {
        title: createTitle(series.name),
        "Language": createRichText(capitalizeFirstLetter(series.language))
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

  formattedSeries.forEach(series => addItemToSeries(series));
}

// formatSeries()

// addItem("Charizard");