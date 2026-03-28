/* Endpoint API do zapisu wyświetlenia strony produktu */

import { NextRequest, NextResponse } from "next/server";
import { incrementProductViews } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    /* Parsujemy body requestu */
    const body = await request.json();

    /* Pobieramy slug produktu */
    const slug =
      typeof body?.slug === "string" ? body.slug.trim() : "";

    /* Jeżeli slug jest pusty, zwracamy błąd */
    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          message: "Brakuje slug produktu.",
        },
        { status: 400 }
      );
    }

    /* Zwiększamy licznik wyświetleń konkretnego produktu */
    const views = await incrementProductViews(slug);

    /* Zwracamy sukces i aktualną liczbę wyświetleń */
    return NextResponse.json({
      ok: true,
      views,
    });
  } catch (error) {
    console.error("Błąd trackowania produktu:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Nie udało się zapisać wyświetlenia produktu.",
      },
      { status: 500 }
    );
  }
}