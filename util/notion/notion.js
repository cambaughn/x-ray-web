import { Client } from "@notionhq/client";
import { notion_api_key, notion_database_id } from "./notionSecrets";

const notion = new Client({ auth: notion_api_key });

const databaseId = notion_database_id;

console.log('ids ', databaseId, notion_api_key);

const addItem = async (text) => {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: { 
          title:[
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

addItem("Yurts in Big Sur, California");