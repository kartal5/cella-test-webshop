const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

// -------------------- Admin SDK Setup --------------------
const admin = require('firebase-admin');
const serviceAccount = require('../cella-test-bachelor-webshop-541266371c3d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
// ---------------------------------------------------------

// 1) Initialize Stripe
const stripe = new Stripe('sk_test_51QafV7Ruib7MNBzAQGfSTHi1ctevCztjnpTucNHx2jNV2K9xsEkLu16WD2J3kQkAizVtcGCjk53cIQ2pXh5ij0B300J0V8UpwZ');

const app = express();
app.use(cors());

// (A) STRIPE WEBHOOK endpoint (raw body)
// Webhook Route defined before using "bodyParser.json()" for all other routes
app.post(
  '/stripe-webhook',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    let event;
    // Verify the Stripe signature via its header
    try {
      const signature = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(
        req.body, // must be raw buffer
        // adding a webhook endpoint (on the Stripe site)..
        signature,
        //  and retrieve its 'signing secret' for this specific webhook endpoint (in Stripe dashboard)
        'whsec_wAryzbfCm3lqf3fakCHFYdXHb4QFddRc'
      );
      console.log('Webhook verified succesfully, event type:', event.type);
    } catch (err) {
      // If verification fails sending this so Stripe knows something went wrong
      console.error('Webhook signature verification failed!:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // "event.type" to handle success/fail events (fx the Stripe event "payment_intent.")
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log('✅ PaymentIntent was successful!', paymentIntent.id);

        // 2) Update the matching order doc in Firestore to "paid"
        try {
          // Firestore query for docs where "paymentIntentId" == event’s paymentIntent.id
          const ordersRef = db.collection('orders');
          const snapshot = await ordersRef
            .where('paymentIntentId', '==', paymentIntent.id)
            .get();

          if (snapshot.empty) {
            console.log('No matching order found for PaymentIntent:', paymentIntent.id);
          } else {
            snapshot.forEach(async (docSnap) => {
              await docSnap.ref.update({ status: 'paid' });
              console.log(`Order ${docSnap.id} updated to status: paid`);
            });
          }
        } catch (updateErr) {
          console.error('Error updating order in Firestore:', updateErr.message);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('❌ PaymentIntent failed:', paymentIntent.id);

        // Or mark order "failed" or "canceled"
        try {
          const ordersRef = db.collection('orders');
          const snapshot = await ordersRef
            .where('paymentIntentId', '==', paymentIntent.id)
            .get();

          if (!snapshot.empty) {
            snapshot.forEach(async (docSnap) => {
              await docSnap.ref.update({ status: 'failed' });
              console.log(`Order ${docSnap.id} updated to status: failed`);
            });
          }
        } catch (err) {
          console.error('Error updating order to failed:', err.message);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.sendStatus(200);
  }
);

// (B) JSON body parsing needed for "create-payment-intent" endpoint
app.use(bodyParser.json());

// (C) CREATE-PAYMENT-INTENT endpoint

// Handles requests from the front-end to get a new "paymentIntent.client_secret",
// the front-end then confirms the payment with that secret
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log(`Creating payment intent for amount: ${amount} DKK`);

    // Create the PaymentIntent on Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in subunits (e.g., 100 means DKK 1.00)
      currency: 'dkk',
    });

    // Return the "client_secret" so the front-end can complete the payment
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch(err) {
    console.error('Error creating payment intent:', err.message);
    res.status(500).send({ error: err.message });
  }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));