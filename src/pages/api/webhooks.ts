import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

const buffer = async (readable: Readable): Promise<Buffer> => {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscriptions.updated",
  "customer.subscriptions.deleted",
]);

const Webhooks = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    const buff = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buff,
        secret ?? "",
        process.env.STRIPE_WEBHOOK_SECRET ?? ""
      );
    } catch (error: any) {
      return res.status(400).send(`Webhook error ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        console.log(type);
        switch (type) {
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription?.toString() ?? "",
              checkoutSession.customer?.toString() ?? "",
              true
            );
            break;

          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
            );
            break;

          default:
            throw new Error("Unhandled event");
        }
      } catch {
        return res.json({ error: "Webhook handler failed" });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};

export default Webhooks;
