import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

function getStripe() {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }
  return stripeInstance;
}

export { getStripe as stripe };

