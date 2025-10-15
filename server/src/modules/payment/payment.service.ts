import stripe from "./config/stripe";
import { PaymentSchemaType } from "./schema/payment.schema";

export class PaymentService {
  async createPaymentSession(data: PaymentSchemaType) {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: data.amount,
            product_data: {
              name: "Donation",
              description: "Support our project",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
    });
  }
}
