import Stripe from 'stripe';
import PaymentPrompt from '../components/PaymentPrompt/PaymentPrompt';

export default function Subscribe({ prices }) {
  console.log('got prices ', prices);
  return (
    <PaymentPrompt />
  )
}

export async function getServerSideProps(context) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const prices = await stripe.prices.list({ active: true })

  return {
    props: { prices: prices.data }, // will be passed to the page component as props
  }
}
