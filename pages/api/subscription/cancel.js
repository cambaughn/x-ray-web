import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (request, response) => {
  const { customer_id } = request.body;

  try {
    const customer = await stripe.customers.retrieve(customer_id);

    let subscription_id = customer.subscriptions.data[0].id;
    let canceled = await stripe.subscriptions.del(subscription_id);
    console.log('canceled => ', !!canceled);

    return response.status(200).json({ canceled })
  } catch(error) {
    console.log(' error    ', error)
    return response.status(400).json({ canceled: false });
  }
}
