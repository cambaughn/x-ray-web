import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (request, response) => {
  const { customer_id } = request.body;

  console.log('getting customer id ===>', customer_id);


  try {
    const customer = await stripe.customers.retrieve(customer_id);

    console.log('customer ', customer);
    let subscriptionData = customer.subscriptions.data[0];
    let subscribed = subscriptionData && subscriptionData.status === 'active';

    return response.status(200).json({ subscriptionStatus: 'active' })
  } catch(error) {
    console.log(' error    ', error)
    return response.status(400).json({ subscriptionStatus: 'not_subscribed' });
  }
}
