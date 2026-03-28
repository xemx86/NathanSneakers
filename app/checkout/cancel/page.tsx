import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="container status-page">
      <div className="info-card status-card">
        <div className="eyebrow">Checkout anulowany</div>
        <h1>Klient wrócił bez płatności</h1>
        <p className="footer-muted">
          Produkty nadal są w koszyku. Możesz ponowić checkout albo wrócić do sklepu.
        </p>
        <div className="inline-actions">
          <Link href="/koszyk" className="button">
            Wróć do koszyka
          </Link>
          <Link href="/sklep" className="button-secondary">
            Kontynuuj zakupy
          </Link>
        </div>
      </div>
    </div>
  );
}
