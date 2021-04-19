import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (request, response) => {
  const { email, name } = request.body;
  console.log('customer => ', email, name);

  try {
    const customer = await stripe.customers.create({ email, name });
    return response.status(200).json({ customer });
  } catch(error) {
    return response.status(400).json({ customer: null });
  }
}
