export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <div className="brand brand--footer">
            <span className="brand__mark">KR</span>
            <span>
              KICK<span>RUSH</span>
            </span>
          </div>
          <div className="footer-muted">Premium storefront · Supabase admin · Stripe-ready checkout</div>
        </div>

        <div className="footer-columns">
          <div>
            <strong>Sklep</strong>
            <div className="footer-muted">Barefoot, lifestyle, premium dropy</div>
          </div>
          <div>
            <strong>Setup</strong>
            <div className="footer-muted">Next.js · Supabase · Stripe</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
