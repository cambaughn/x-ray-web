import { updateSalesForCard } from '../../../util/eBay/listings.js'

export default async (request, response) => {
  const { card } = request.body;

  try {
    if (card.name) {
      console.log('getting sales ===>');
      let updated = await updateSalesForCard(card);
      return response.status(200).json({ updated: true })
    } else { // could not update card
      return response.status(400).json({ error: 'Could not update card.' });
    }
  } catch(error) {
    return response.status(400).json({ error: 'Could not update card.' });
  }
}
