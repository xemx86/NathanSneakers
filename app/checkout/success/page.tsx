import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export default function CheckoutSuccessPage() {
  return (
    <div className="container status-page">
      <ClearCartOnMount />
      <div className="info-card status-card">
        <div className="eyebrow">Płatność</div>
        <h1>Checkout zakończony powodzeniem</h1>
        <p className="footer-muted">
          To jest strona powrotu po płatności. Do pełnej produkcji dorzuć webhook Stripe i obsługę zamówień w bazie.
        </p>
        <div className="inline-actions">
          <Link href="/sklep" className="button">
            Wróć do sklepu
          </Link>
          <Link href="/admin" className="button-secondary">
            Panel admina
          </Link>
        </div>
      </div>
    </div>
  );
}
