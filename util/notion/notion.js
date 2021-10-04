import { Client } from "@notionhq/client";
import { notion_api_key, cardsId, setsId, seriesId } from "./notionSecrets";

const notion = new Client({ auth: notion_api_key });

console.log('ids ', cardsId, notion_api_key);


const addItem = async (text) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: seriesId },
      properties: {
        title: { 
          title: [
            {
              "text": {
                "content": text
              }
            }
          ]
        }
      },
    })
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body)
  }
}

addItem("Charizard");