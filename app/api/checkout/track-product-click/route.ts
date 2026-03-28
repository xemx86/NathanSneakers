/* Endpoint API do zapisu kliknięcia w produkt */

import { NextRequest, NextResponse } from "next/server";
import { incrementProductClicks } from "@/lib/analytics";

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

    /* Zwiększamy licznik kliknięć produktu */
    const clicks = await incrementProductClicks(slug);

    /* Zwracamy sukces */
    return NextResponse.json({
      ok: true,
      clicks,
    });
  } catch (error) {
    console.error("Błąd trackowania kliknięcia produktu:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Nie udało się zapisać kliknięcia produktu.",
      },
      { status: 500 }
    );
  }
}