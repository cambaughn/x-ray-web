export default async (request, response) => {
  const { card } = request.body;

  try {
    if (card.name) {
      let updated = await updateSalesForCard(card);
      if (updated) {
        return response.status(200).json({ updated: true })
      }
    }

    return response.status(400).json({ error: 'Could not update card.' });
  } catch(error) {
    return response.status(400).json({ error: 'Could not update card.' });
  }
}
