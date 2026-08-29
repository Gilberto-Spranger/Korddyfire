// /api/stripe/request-card/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build') as string, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, name, email, phone, birthdate, nationality, address, currency } = body;

    if (!userId || !name || !email || !phone || !birthdate || !nationality || !address || !currency) {
      return NextResponse.json(
        {
          error: {
            message: "Campos obrigatórios faltando.",
            type: "validation_error",
            statusCode: 400,
            fields: { userId, name, email, phone, birthdate, nationality, address, currency },
          },
        },
        { status: 400 }
      );
    }

    const [day, month, year] = birthdate.split("/").map(Number);

    const cardholder = await stripe.issuing.cardholders.create({
      name,
      email,
      phone_number: phone,
      status: "active",
      type: "individual",
      individual: {
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" ") || "",
        dob: { day, month, year },
      },
      billing: {
        address: {
          line1: address.line1,
          city: address.city,
          country: address.country,
          postal_code: address.postal_code,
          state: address.state,
        },
      },
    });

    const card = await stripe.issuing.cards.create({
      cardholder: cardholder.id,
      currency,
      type: "virtual",
    });

    return NextResponse.json({ message: "Card created successfully", card }, { status: 200 });
  } catch (err: unknown) {
    console.error("[ERROR]", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        {
          error: {
            message: err.message,
            type: err.type,
            statusCode: err.statusCode ?? 500,
          },
        },
        { status: err.statusCode ?? 500 }
      );
    }

    if (err instanceof Error) {
      return NextResponse.json(
        {
          error: {
            message: err.message,
            type: "server_error",
            statusCode: 500,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: "Erro desconhecido ao criar cartão.",
          type: "unknown_error",
          statusCode: 500,
        },
      },
      { status: 500 }
    );
  }
}