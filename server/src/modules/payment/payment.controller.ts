import { asyncHandler } from "../../lib/AsyncHandler";
import { PaymentService } from "./payment.service";
import { ResponseApi } from "../../lib/ResponseApi";
import { STRIPE_WEBHOOK_SECRET } from "./config/stripe.env";
import stripe from "./config/stripe";
import { PaymentSchema } from "./schema/payment.schema";

export class PaymentController {
  createPaymentSession = asyncHandler(async (req, res) => {
    const body = PaymentSchema.parse(req.body);

    const session = await this.paymentService.createPaymentSession(body);

    return ResponseApi(res, 200, "success", {
      url: session?.url,
    });
  });

  webhook = asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"]!;

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET,
      );

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const userId = session.customer;
          const amountPaid = session.amount_total;

          console.log(amountPaid);
          // await prisma.payment.create({
          //   data: {},
          // });
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  constructor(private readonly paymentService = new PaymentService()) {}
}
