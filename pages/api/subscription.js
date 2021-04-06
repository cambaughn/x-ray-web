import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (request, response) => {
  const { email } = request.body;

  try {
    console.log('email ===> ', email);
    const customer = await stripe.customers.retrieve(email);
    console.log('customer ===> ', customer);

    // TODO: set subscribed to whatever we find on the customer object
    let subscribed = false;


    return response.status(200).json({ subscribed })
  } catch(error) {
    console.log(' error    ', error)
    return response.status(400).json({ subscribed: false });
  }
}
