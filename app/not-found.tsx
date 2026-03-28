import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "60px 0" }}>
      <div className="info-card" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h1>Nie znaleziono strony</h1>
        <p className="footer-muted">Ten adres nie istnieje albo produkt został usunięty.</p>
        <Link className="button" href="/">
          Wróć na start
        </Link>
      </div>
    </div>
  );
}
