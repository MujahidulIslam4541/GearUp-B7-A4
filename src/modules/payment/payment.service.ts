import type Stripe from "stripe";
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib";
import { stripe } from "../../lib/stripe";
import HttpStatus from "http-status";
import config from "../../config";
import { PaymentStatus, RentalStatus } from "../../../prisma/generated/prisma/enums";

const createPaymentSession = async (customerId: string, orderId: string) => {

    const order = await prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { gearItem: true, payment: true }
    });

    if (!order) {
        throw new AppError(HttpStatus.NOT_FOUND, "rental order not found");
    }

    if (order.customerId !== customerId) {
        throw new AppError(HttpStatus.FORBIDDEN, "you can only pay for your own orders");
    }

    if (order.payment) {
        throw new AppError(HttpStatus.BAD_REQUEST, "payment already initiated for this order");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: order.gearItem.name
                    },
                    unit_amount: Math.round(order.totalAmount * 100)
                },
                quantity: 1
            }
        ],
        success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/payment/cancel`,
        metadata: {
            orderId: order.id
        }
    });

    await prisma.payment.create({
        data: {
            amount: order.totalAmount,
            status: PaymentStatus.PENDING,      
            stripeSessionId: session.id,
            rentalOrderId: order.id
        }
    });

    return { checkoutUrl: session.url };
};


const confirmPayment = async (rawBody: Buffer, signature: string) => {

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err) {
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid webhook signature");
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) return { received: true };

        await prisma.payment.update({
            where: { stripeSessionId: session.id },
            data: {
                status: PaymentStatus.COMPLETED,  
                stripePaymentIntentId: session.payment_intent as string
            }
        });

        await prisma.rentalOrder.update({
            where: { id: orderId },
            data: { status: RentalStatus.PAID }    
        });
    }
    if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
        const session = event.data.object as Stripe.Checkout.Session;

        await prisma.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: { status: PaymentStatus.FAILED }  
        });
    }

    return { received: true };
};

export const paymentService = { createPaymentSession, confirmPayment };