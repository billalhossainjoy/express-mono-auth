import stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./stripe.env";

export default new stripe(STRIPE_SECRET_KEY);
