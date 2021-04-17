export default async (request, response) => {
  const { card } = request.body;

  console.log('card => ', card);

  try {

    return response.status(200).json({ updated: 'active' })
  } catch(error) {
    console.log(' error    ', error)
    return response.status(400).json({ error: 'Could not update card.' });
  }
}
