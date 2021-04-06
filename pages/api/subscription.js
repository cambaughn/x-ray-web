import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (request, response) => {
  const { email } = request.body;

  try {
    const customer = await stripe.customers.retrieve(
      'cam.baughn@gmail.com'
    );

    console.log('customer ===> ', customer);
    return response.status(200).json({ status: 'subscribed' })
  } catch(error) {

  }
}
