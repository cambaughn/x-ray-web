import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_9YRaJEJThomoL3InPMbzYmi5');

export default stripePromise;
